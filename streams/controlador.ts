import { Request, Response } from 'express';

let streamsDB: any[] = [];

export const getStreams = (req: Request, res: Response) => {
    res.json(streamsDB);
};

export const startStream = (req: Request, res: Response) => {
    const { usuario, titulo, categoria, avatar } = req.body;
    
    const newStream = {
        id: Date.now().toString(),
        usuario,
        titulo,
        categoria,
        viewers: "1 (Tú)",
        avatar: avatar || "S",
        color: "#00ff41",
        isReal: true
    };

    streamsDB.push(newStream);
    res.json({ msg: "Stream iniciado", streamId: newStream.id });
};

export const stopStream = (req: Request, res: Response) => {
    const { id } = req.params;
    streamsDB = streamsDB.filter(s => s.id !== id);
    res.json({ msg: "Stream eliminado" });
};
