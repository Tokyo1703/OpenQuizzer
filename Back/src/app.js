import express, { json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import UsuarioRouter from './routes/usuario.js'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'

dotenv.config()
const app = express()
app.use(json())
app.use(cookieParser())
app.use(cors())

app.use((req,res,next)=>{
  

  try{
    const token = req.cookies.access_token
    const infoUsuario = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    req.usuario = infoUsuario

  }
  catch(error){   
    req.usuario = null
  }
  next()
})

app.disable('x-powered-by')

app.use('/usuarios', UsuarioRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

})