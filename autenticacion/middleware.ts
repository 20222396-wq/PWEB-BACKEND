import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: number;
  userRol?: string;
}

export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ msg: 'No hay token, acceso denegado' });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    req.userId = decoded.id;
    req.userRol = decoded.rol;
    
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Token inválido' });
  }
};