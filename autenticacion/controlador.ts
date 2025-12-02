import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const usersDB: any[] = []; 

export const register = async (req: Request, res: Response) => {
    try {
        const { nombre, email, password } = req.body;

      
        const userExists = usersDB.find(u => u.email === email);
        if (userExists) return res.status(400).json({ msg: 'El usuario ya existe' });

        
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = {
            id: Date.now(), 
            nombre,
            email,
            password: passwordHash, 
            rol: 'streamer',
            monedas: 0,
            nivel: 1
        };
        
        usersDB.push(newUser); 

        res.status(201).json({ msg: 'Usuario registrado exitosamente', userId: newUser.id });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = usersDB.find(u => u.email === email);
        if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });

        const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '1h'
        });

        res.json({ token, user: { nombre: user.nombre, rol: user.rol, monedas: user.monedas } });
    } catch (error) {
        res.status(500).json({ msg: 'Error al iniciar sesión' });
    }
    
};
export { usersDB };