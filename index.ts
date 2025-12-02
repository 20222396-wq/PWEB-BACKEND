import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { register, login } from './autenticacion/controlador';
import { getStreams, startStream, stopStream } from './streams/controlador';
import nivelesRoutes from './niveles/routes';
import { PrismaClient } from './generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.get('/', (req, res) => {
    res.send('API Streaming funcionando 🚀');
});


// Auth endpoints as requested
app.post('/auth/register', register);
app.post('/auth/login', login);

app.get('/api/streams', getStreams);       
app.post('/api/streams/start', startStream); 
app.delete('/api/streams/stop/:id', stopStream); 

app.use('/api/streamer', nivelesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

