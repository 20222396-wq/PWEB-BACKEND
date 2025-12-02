import { Request, Response } from 'express';

const configuracionNivelesDB: any[] = [];

export const configurarNiveles = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const streamerId = userId || 1;
    const { niveles } = req.body;

    if (!niveles || !Array.isArray(niveles)) {
      return res.status(400).json({ 
        success: false,
        msg: 'Datos inválidos - se requiere array de niveles' 
      });
    }

    if (niveles.length < 2) {
      return res.status(400).json({ 
        success: false,
        msg: 'Debe haber al menos 2 niveles' 
      });
    }

    for (let i = 1; i < niveles.length; i++) {
      const nivelActual = niveles[i];
      const nivelAnterior = niveles[i-1];
      
      if (!nivelActual || !nivelAnterior || 
          typeof nivelActual.xpRequerido !== 'number' || 
          typeof nivelAnterior.xpRequerido !== 'number') {
        return res.status(400).json({ 
          success: false,
          msg: `Datos de nivel inválidos en posición ${i}` 
        });
      }
      
      if (nivelActual.xpRequerido <= nivelAnterior.xpRequerido) {
        return res.status(400).json({ 
          success: false,
          msg: `Los niveles deben ser progresivos. Nivel ${i}: ${nivelAnterior.xpRequerido} XP → Nivel ${i+1}: ${nivelActual.xpRequerido} XP` 
        });
      }
    }

    const index = configuracionNivelesDB.findIndex(c => c.streamer_id === streamerId);
    
    const configData = { 
      streamer_id: streamerId, 
      niveles,
      actualizado: new Date().toISOString()
    };
    
    if (index !== -1) {
      configuracionNivelesDB[index] = configData;
    } else {
      configuracionNivelesDB.push(configData);
    }

    res.json({ 
      success: true,
      msg: '✅ Configuración guardada correctamente', 
      niveles,
      totalNiveles: niveles.length,
      streamerId: streamerId
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      msg: 'Error del servidor al guardar configuración' 
    });
  }
};

export const obtenerNivelesPropios = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const streamerId = userId || 1;
    
    const config = configuracionNivelesDB.find(c => c.streamer_id === streamerId);

    if (!config) {
      const nivelesDefault = [
        { nivel: 1, xpRequerido: 0 },
        { nivel: 2, xpRequerido: 100 },
        { nivel: 3, xpRequerido: 300 },
        { nivel: 4, xpRequerido: 600 },
        { nivel: 5, xpRequerido: 1000 },
      ];
      return res.json({ 
        success: true,
        niveles: nivelesDefault,
        esDefault: true,
        streamerId: streamerId
      });
    }
    
    res.json({ 
      success: true,
      niveles: config.niveles,
      esDefault: false,
      streamerId: streamerId
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      msg: 'Error del servidor al obtener configuración' 
    });
  }
};

export const obtenerNivelesStreamer = async (req: Request, res: Response) => {
  try {
    const { streamerId } = req.params;

    if (!streamerId) {
      return res.status(400).json({ 
        success: false,
        msg: 'ID de streamer no proporcionado' 
      });
    }
    
    const streamerIdNum = parseInt(streamerId);

    if (isNaN(streamerIdNum)) {
      return res.status(400).json({ 
        success: false,
        msg: 'ID de streamer inválido' 
      });
    }
    
    const config = configuracionNivelesDB.find(c => c.streamer_id === streamerIdNum);

    if (!config) {
      const nivelesDefault = [
        { nivel: 1, xpRequerido: 0 },
        { nivel: 2, xpRequerido: 100 },
        { nivel: 3, xpRequerido: 300 },
        { nivel: 4, xpRequerido: 600 },
        { nivel: 5, xpRequerido: 1000 },
      ];
      return res.json({ 
        success: true,
        niveles: nivelesDefault,
        esDefault: true,
        streamerId: streamerIdNum
      });
    }

    res.json({ 
      success: true,
      niveles: config.niveles,
      esDefault: false,
      streamerId: streamerIdNum
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      msg: 'Error del servidor al obtener niveles del streamer' 
    });
  }
};
