import {Router} from 'express'
import {ResultadoController} from '../controllers/resultado.js'
import Autenticacion from '../middlewares/autenticacion.js'

const ResultadoRouter = Router()

//Rutas públicas

//Rutas protegidas con autenticación
ResultadoRouter.use(Autenticacion(["Creador", "Participante"]))

ResultadoRouter.post('/crearResultadoCuestionarioIndividual', ResultadoController.CreateResultadoCuestionarioIndividual)
ResultadoRouter.get('/getResultadosIndividuales/', ResultadoController.GetListaResultadoIndividual)
ResultadoRouter.get('/getResultadoIndividual/:id', ResultadoController.GetResultadoIndividual)

export default ResultadoRouter;