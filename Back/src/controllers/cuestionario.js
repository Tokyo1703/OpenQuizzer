import { CuestionarioModel } from "../models/cuestionario.js";

export class CuestionarioController {
    static async Create(req, res) {    
        const inputData = req.body

        try {
            await CuestionarioModel.Create({inputData})
            res.status(201).json({Mensaje: "Cuestionario creado"})
        } catch (error) {
            res.status(error.code || 500).json({Error: error.message})
        }
    }

    static async ListarPublicos(req, res) {
        try {
            const cuestionarios = await CuestionarioModel.ListarPublicos()
            res.status(200).json({Mensaje:"Lista de cuestionarios obtenidos",cuestionarios})
        } catch (error) {
            res.status(error.code || 500).json({ Error: error.message })
        }
    }

    static async ListarMisCuestionarios(req, res) {
        const token = req.cookies.access_token
        

        try {
            const cuestionarios = await CuestionarioModel.ListarMisCuestionarios(token)
            res.status(200).json({ Mensaje: "Lista de cuestionarios obtenidos", cuestionarios })
        } catch (error) {
            res.status(error.code || 500).json({ Error: error.message })
        }
    }
    static async CompletoPublico(req, res) {
        const inputData = req.params
        
        try {
            const token = req.cookies.access_token
            const { cuestionario, preguntas } = await CuestionarioModel.CompletoPublico({inputData}, token)
            res.status(200).json({ Mensaje: "Cuestionario obtenido", cuestionario, preguntas })
        } catch (error) {
            res.status(error.code || 500).json({ Error: error.message })
        }
    }

    static async Completo(req, res) {
        const inputData = req.params

        try {
            const token = req.cookies.access_token
            const { cuestionario, preguntas } = await CuestionarioModel.MiCuestionarioCompleto({inputData}, token)
            res.status(200).json({ Mensaje: "Cuestionario obtenido", cuestionario, preguntas })
        } catch (error) {
            res.status(error.code || 500).json({ Error: error.message })
        }
    }
}
