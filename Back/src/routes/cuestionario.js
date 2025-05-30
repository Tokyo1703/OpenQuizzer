import {Router} from 'express'
import {CuestionarioController} from '../controllers/cuestionario.js'
import Autenticacion from '../middlewares/autenticacion.js'

const CuestionarioRouter = Router()

//Rutas públicas
CuestionarioRouter.get('/publicos', CuestionarioController.ListarPublicos)
CuestionarioRouter.get('/completoPublico/:id', CuestionarioController.CompletoPublico)

//Rutas protegidas con autenticación
CuestionarioRouter.use(Autenticacion(["Creador"]))
CuestionarioRouter.get('/completo/:id', CuestionarioController.Completo)
CuestionarioRouter.get('/misCuestionarios', CuestionarioController.ListarMisCuestionarios)
CuestionarioRouter.post('/crear', CuestionarioController.Create)
CuestionarioRouter.put('/modificar', CuestionarioController.Modificar)
CuestionarioRouter.delete('/borrar/:id', CuestionarioController.Borrar)

export default CuestionarioRouter;