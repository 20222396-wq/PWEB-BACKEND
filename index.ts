import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { register, login } from './autenticacion/controlador';
import { getStreams, startStream, stopStream } from './streams/controlador';
import nivelesRoutes from './niveles/routes';
import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient();

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('API Streaming funcionando 🚀');
});


app.post('/api/register', register);
app.post('/api/login', login);

app.get('/api/streams', getStreams);       
app.post('/api/streams/start', startStream); 
app.delete('/api/streams/stop/:id', stopStream); 

app.use('/api/streamer', nivelesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

