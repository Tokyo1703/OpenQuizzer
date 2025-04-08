import express, { json } from 'express'
import cors from 'cors'
import UsuarioRouter from './routes/usuario.js'

const app = express();
app.use(json());
app.use(cors());

app.use((req,res,next)=>{
  const token = req.cookies.acces_token;
  let data = null;
  req.session = {user: null};

  try{
    data = jwt.verify(token, process.env.JWT_SECRET);
    req.session.user = data;
  }
  catch(error){
    req.session.user = null;
    res.status(401).send("Error de autenticación");
  }

  next();
});

app.disable('x-powered-by')

app.use('/usuarios', UsuarioRouter);
app.use('/login', UsuarioRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

})