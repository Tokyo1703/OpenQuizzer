import {Router} from 'express'
import {UsuarioController} from '../controllers/usuario.js'
import Autenticacion from '../middlewares/autenticacion.js'

const UsuarioRouter = Router()

UsuarioRouter.get('/get/:nombreUsuario', UsuarioController.GetByNombreUsuario)

UsuarioRouter.post('/login', UsuarioController.Login)
UsuarioRouter.post('/crear', UsuarioController.Create)


//Rutas protegidas con autenticación
UsuarioRouter.use(Autenticacion())

UsuarioRouter.put('/modificar', UsuarioController.Modificar)
UsuarioRouter.get('/perfil', UsuarioController.Perfil)
UsuarioRouter.post('/logout', UsuarioController.Logout)

export default UsuarioRouter;