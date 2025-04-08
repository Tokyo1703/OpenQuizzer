import {Router} from 'express';
import { UsuarioController } from '../controllers/usuario.js';

const UsuarioRouter = Router();

UsuarioRouter.get('/:nombreUsuario', UsuarioController.GetByNombreUsuario);

UsuarioRouter.post('/', UsuarioController.Create);

UsuarioRouter.post('/login', UsuarioController.Login)



export default UsuarioRouter;