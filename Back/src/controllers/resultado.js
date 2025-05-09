import { ResultadoModel } from "../models/resultado.js";

export class ResultadoController {

    static async CreateResultadoCuestionarioIndividual(req, res) {    
        const inputData = req.body

        try {
            await ResultadoModel.CreateResultadoCuestionarioIndividual({inputData})
            res.status(201).json({Mensaje: "Resultado creado"})
        } catch (error) {
            res.status(error.code || 500).json({Error: error.message})
        }
    }

    static async GetListaResultadoIndividual(req, res) {
        try {
            const token = req.cookies.access_token
            const {resultados, cuestionarios} = await ResultadoModel.GetListaResultadoIndividual(token)
            res.status(200).json({Mensaje:"Lista de resultados obtenidos", resultados, cuestionarios})
        } catch (error) {
            res.status(error.code || 500).json({ Error: error.message })
        }
    }

    static async GetResultadoIndividual(req, res) {
        const inputData = req.params

        try {
            const token = req.cookies.access_token
            const{resultado, cuestionario, preguntasContestadas} = await ResultadoModel.GetResultadoIndividual({inputData}, token)
            res.status(200).json({ Mensaje: "Resultado obtenido", resultado, cuestionario, preguntasContestadas })
        } catch (error) {
            res.status(error.code || 500).json({ Error: error.message })
        }
    }
}