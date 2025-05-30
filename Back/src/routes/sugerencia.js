import {Router} from 'express'
import {SugerenciaController} from '../controllers/sugerencia.js'

const SugerenciaRouter = Router()

SugerenciaRouter.post('/crear', SugerenciaController.Crear)

export default SugerenciaRouter;