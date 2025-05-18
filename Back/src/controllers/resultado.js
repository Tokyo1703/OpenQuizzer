import { ResultadoModel } from "../models/resultado.js";

export class ResultadoController {

    static async CreateResultadoCuestionarioIndividual(req, res) {    
        const inputData = req.body

        try {
            const {idResultado} = await ResultadoModel.CreateResultadoCuestionarioIndividual({inputData})
            res.status(201).json({Mensaje: "Resultado creado", idResultado})
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

    static async GetListaResultadoGrupal(req, res) {
        try {
            const token = req.cookies.access_token
            const {resultados, cuestionarios} = await ResultadoModel.GetListaResultadoGrupal(token)
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

    static async GetResultadoGrupal(req, res) {
        const inputData = req.params

        try {
            const token = req.cookies.access_token
            const {resultado, cuestionario} = await ResultadoModel.getResultadoGrupal({inputData}, token)
            res.status(200).json({ Mensaje: "Resultado obtenido", resultado, cuestionario })
        } catch (error) {
            res.status(error.code || 500).json({ Error: error.message })
        }
    }

    static async GetRanking(req, res) {
        const inputData = req.params

        try {
            const token = req.cookies.access_token
            const ranking = await ResultadoModel.getRanking({inputData}, token)
            res.status(200).json({ Mensaje: "Ranking obtenido", ranking })
        } catch (error) {
            res.status(error.code || 500).json({ Error: error.message })
        }
    }

    static async CreateResultadoGrupal(req, res){
        const inputData = req.body

        try {
            const {idResultado} = await ResultadoModel.CreateResultadoGrupal({inputData})
            res.status(201).json({Mensaje: "Resultado creado", idResultado})
        } catch (error) {
            res.status(error.code || 500).json({Error: error.message})
        }   
    }

    static async CreateGrupalIndividual(req, res){
        const inputData = req.body

        try {
            await ResultadoModel.CreateGrupalIndividual({inputData})
            res.status(201).json({Mensaje: "Resultado asociado correctamente"})
        } catch (error) {
            res.status(error.code || 500).json({Error: error.message})
        }   
    }
}