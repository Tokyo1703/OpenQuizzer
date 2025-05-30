import { SugerenciaModel } from "../models/sugerencia.js"

export class SugerenciaController {
    static async Crear(req, res) {
        const inputData = req.body
        try {
            await SugerenciaModel.Crear({inputData})
            res.status(201).json({Mensaje: "Sugerencia guardada"})
        } catch (error) {
            res.status(error.code || 500).json({Error: error.message})
        }
    }
}