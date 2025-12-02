"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verificarToken = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ msg: 'No hay token, acceso denegado' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        req.userId = decoded.id;
        req.userRol = decoded.rol;
        next();
    }
    catch (error) {
        return res.status(401).json({ msg: 'Token inválido' });
    }
};
exports.verificarToken = verificarToken;
//# sourceMappingURL=middleware.js.map