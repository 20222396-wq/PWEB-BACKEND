"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopStream = exports.startStream = exports.getStreams = void 0;
let streamsDB = [];
const getStreams = (req, res) => {
    res.json(streamsDB);
};
exports.getStreams = getStreams;
const startStream = (req, res) => {
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
exports.startStream = startStream;
const stopStream = (req, res) => {
    const { id } = req.params;
    streamsDB = streamsDB.filter(s => s.id !== id);
    res.json({ msg: "Stream eliminado" });
};
exports.stopStream = stopStream;
//# sourceMappingURL=controlador.js.map