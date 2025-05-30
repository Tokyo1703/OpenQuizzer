import connection from '../connection_db/connection.js'
export class SugerenciaModel {
    static async Crear({inputData}){
        const {
            nombreCompleto,
            correo,
            contenido
        } = inputData.sugerencia
        try {
            const sugerencia = await connection.query(
                `INSERT INTO sugerencia (nombreCompleto, correo, contenido) VALUES (?, ?, ?)`,
                [nombreCompleto, correo, contenido]
            )

        }
        catch(e){
            const error = new Error(e.message)
            error.code = 500
            throw error
        }
    }
}