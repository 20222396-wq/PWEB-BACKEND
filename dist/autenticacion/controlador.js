"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersDB = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usersDB = [];
exports.usersDB = usersDB;
const register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const userExists = usersDB.find(u => u.email === email);
        if (userExists)
            return res.status(400).json({ msg: 'El usuario ya existe' });
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
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
    }
    catch (error) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = usersDB.find(u => u.email === email);
        if (!user)
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        const token = jsonwebtoken_1.default.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '1h'
        });
        res.json({ token, user: { nombre: user.nombre, rol: user.rol, monedas: user.monedas } });
    }
    catch (error) {
        res.status(500).json({ msg: 'Error al iniciar sesión' });
    }
};
exports.login = login;
//# sourceMappingURL=controlador.js.map