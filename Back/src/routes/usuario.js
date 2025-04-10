import {Router} from 'express';
import { UsuarioController } from '../controllers/usuario.js';

const UsuarioRouter = Router();

UsuarioRouter.get('/get/:nombreUsuario', UsuarioController.GetByNombreUsuario);

UsuarioRouter.post('/crear', UsuarioController.Create);

UsuarioRouter.post('/login', UsuarioController.Login)



export default UsuarioRouter;