/*
    OpenQuizzer  © 2025 by Carla Bravo Maestre is licensed under CC BY 4.0.
    To view a copy of this license, visit https://creativecommons.org/licenses/by/4.0/
*/
import express, { json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import UsuarioRouter from './routes/usuario.js'
import CuestionarioRouter from './routes/cuestionario.js'
import ResultadoRouter from './routes/resultado.js'
import cookieParser from 'cookie-parser'
import {Server} from 'socket.io'
import { createServer} from 'node:http'
import socketHandler from './sockets/socket.js'
import SugerenciaRouter from './routes/sugerencia.js'

dotenv.config()
const app = express()
app.use(json())
app.use(cookieParser())
app.use(cors({
  origin: ['http://localhost:4200', 'http://angular_container:4200'], 
  credentials: true                
}))
app.disable('x-powered-by')

app.use('/usuarios', UsuarioRouter);
app.use('/cuestionarios', CuestionarioRouter);
app.use('/resultados', ResultadoRouter);
app.use('/sugerencias', SugerenciaRouter);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:4200', 'http://angular_container:4200'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

socketHandler(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})