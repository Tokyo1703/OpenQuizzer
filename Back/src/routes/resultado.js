import {Router} from 'express'
import {ResultadoController} from '../controllers/resultado.js'
import Autenticacion from '../middlewares/autenticacion.js'

const ResultadoRouter = Router()

//Rutas públicas
ResultadoRouter.post('/crearGrupalIndividual', ResultadoController.CreateGrupalIndividual)
ResultadoRouter.post('/crearResultadoCuestionarioIndividual', ResultadoController.CreateResultadoCuestionarioIndividual)

//Rutas protegidas con autenticación
ResultadoRouter.use(Autenticacion(["Creador", "Participante"]))
ResultadoRouter.post('/crearResultadoGrupal', ResultadoController.CreateResultadoGrupal)
ResultadoRouter.get('/getResultadosIndividuales/', ResultadoController.GetListaResultadoIndividual)
ResultadoRouter.get('/getResultadosGrupales/', ResultadoController.GetListaResultadoGrupal)
ResultadoRouter.get('/getResultadoIndividual/:id', ResultadoController.GetResultadoIndividual)
ResultadoRouter.get('/getResultadoGrupal/:id', ResultadoController.GetResultadoGrupal)
ResultadoRouter.get('/getRanking/:id', ResultadoController.GetRanking)

export default ResultadoRouter;