import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const register = async (req: Request, res: Response) => {
    try {
        const { usuario, email, password, nombre, apellido } = req.body;

        if ((!usuario && !email) || !password) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        const existing = await prisma.usuario.findFirst({
            where: {
                OR: [
                    email ? { email } : undefined,
                    usuario ? { username: usuario } : undefined,
                ].filter(Boolean) as any,
            },
        });
        if (existing) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const created = await prisma.usuario.create({
            data: {
                username: usuario || email,
                email,
                contraseña: passwordHash,
                activo: true,
            },
        });

        const token = jwt.sign({ id: created.id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '1h',
        });

        return res.status(201).json({
            token,
            user: { id: created.id, usuario: created.username, email: created.email },
            message: 'Usuario registrado exitosamente',
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, usuario, password } = req.body;
        if (!password || (!email && !usuario)) {
            return res.status(400).json({ message: 'Faltan credenciales' });
        }

        const user = await prisma.usuario.findFirst({
            where: {
                OR: [
                    email ? { email } : undefined,
                    usuario ? { username: usuario } : undefined,
                ].filter(Boolean) as any,
            },
        });
        if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

        const isMatch = await bcrypt.compare(password, user.contraseña);
        if (!isMatch) return res.status(401).json({ message: 'Credenciales inválidas' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '1h',
        });

        return res.status(200).json({
            token,
            user: { id: user.id, usuario: user.username, email: user.email },
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};