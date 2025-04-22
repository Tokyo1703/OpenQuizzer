import express, { json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import UsuarioRouter from './routes/usuario.js'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express()
app.use(json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:4200', 
  credentials: true                
}))
app.disable('x-powered-by')

app.use('/usuarios', UsuarioRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})