import { Router, Request, Response } from 'express';
import { 
  configurarNiveles, 
  obtenerNivelesPropios, 
  obtenerNivelesStreamer 
} from './controlador';

const router = Router();

const verificarToken = (req: Request, res: Response, next: Function) => {
  try {
    console.log('=== VERIFICANDO TOKEN ===');
    console.log('Headers recibidos:', req.headers);
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No hay token en headers o formato incorrecto');
      return res.status(401).json({ msg: 'Token no proporcionado' });
    }
    
    const token = authHeader.split(' ')[1];
    
    
    if (!token) {
      console.log('Token está vacío después de split');
      return res.status(401).json({ msg: 'Token inválido' });
    }
    
    console.log('Token recibido:', token.length > 20 ? token.substring(0, 20) + '...' : token);
    
    if (token.length < 10) {
      console.log('Token demasiado corto');
      return res.status(401).json({ msg: 'Token inválido - formato incorrecto' });
    }
    
    (req as any).userId = 1;
    (req as any).userRol = 'streamer';
    
    console.log('✅ Token aceptado (modo desarrollo)');
    console.log('Usuario simulado:', { id: 1, rol: 'streamer' });
    console.log('=== FIN VERIFICACIÓN ===\n');
    
    next();
  } catch (error) {
    console.error('Error en verificarToken:', error);
    return res.status(401).json({ msg: 'Error de autenticación' });
  }
};

const verificarStreamer = (req: Request, res: Response, next: Function) => {
  console.log('Verificando si es streamer...');

  const userId = (req as any).userId || 1;
  const userRol = (req as any).userRol || 'streamer';
  
  console.log('Streamer verificado:', { userId, userRol });
  
  (req as any).userId = userId;
  (req as any).userRol = userRol;
  
  next();
};

router.get('/test', (req: Request, res: Response) => {
  res.json({ 
    message: 'Router de niveles funcionando',
    ruta: '/api/streamer/test',
    tiempo: new Date().toISOString()
  });
});


router.post('/debug-config', (req: Request, res: Response) => {
  console.log('DEBUG: Petición POST recibida en /debug-config');
  console.log('Body:', req.body);
  
  res.json({ 
    success: true, 
    message: 'DEBUG: Endpoint funciona correctamente',
    dataRecibida: req.body,
    timestamp: new Date().toISOString()
  });
});
router.post('/configurar-niveles', verificarToken, verificarStreamer, configurarNiveles);
router.get('/obtener-niveles', verificarToken, verificarStreamer, obtenerNivelesPropios);

router.get('/niveles-streamer/:streamerId', obtenerNivelesStreamer);

export default router;