"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const controlador_1 = require("./autenticacion/controlador");
const controlador_2 = require("./streams/controlador");
const routes_1 = __importDefault(require("./niveles/routes"));
const index_js_1 = require("./generated/prisma/index.js");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = __importDefault(require("pg"));
const pool = new pg_1.default.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new index_js_1.PrismaClient({ adapter });
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send('API Streaming funcionando 🚀');
});
app.post('/api/register', controlador_1.register);
app.post('/api/login', controlador_1.login);
app.get('/api/streams', controlador_2.getStreams);
app.post('/api/streams/start', controlador_2.startStream);
app.delete('/api/streams/stop/:id', controlador_2.stopStream);
app.use('/api/streamer', routes_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
//# sourceMappingURL=index.js.map