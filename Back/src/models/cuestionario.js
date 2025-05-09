import connection from '../connection_db/connection.js'
import jwt from 'jsonwebtoken'

export class CuestionarioModel {

    static async Create({inputData}) {

        const cuestionario = inputData.cuestionario

        try {
            const [resQueryCuestionario] = await connection.query(
                `INSERT INTO cuestionario (nombreUsuario, nombre, descripcion, privacidad)
                 VALUES (?, ?, ?, ?)`,
                [cuestionario.nombreUsuario, cuestionario.nombre, cuestionario.descripcion, cuestionario.privacidad]
            )

            for (const pregunta of inputData.preguntas) {
                const [resQueryPregunta] = await connection.query(
                    `INSERT INTO pregunta (idCuestionario, tipo, tiempo, contenido, puntuacion, puntosSegundo)
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [resQueryCuestionario.insertId, pregunta.tipo,
                    pregunta.tiempo, pregunta.contenido,
                    pregunta.puntuacion, pregunta.puntosSegundo]
                )

                for (const respuesta of pregunta.respuestas) {
                    await connection.query(
                        `INSERT INTO respuesta (idPregunta, contenido, correcta)
                         VALUES (?, ?, ?)`,
                        [resQueryPregunta.insertId, respuesta.contenido, respuesta.correcta]
                    )
                }
            }

        }
        catch(e){
            const error = new Error("Error de acceso a la base de datos")
            error.code = 500
            throw error
        }
    }

    static async ListarPublicos() {
        try {
            const [cuestionarios] = await connection.query(
                `SELECT * FROM cuestionario WHERE privacidad = "Publico"`
            )
            return cuestionarios
        } catch (e) {
            const error = new Error("Error de acceso a la base de datos")
            error.code = 500
            throw error
        }
    }

    static async ListarMisCuestionarios(token) {
        const infoUsuario = jwt.verify(token, process.env.JWT_SECRET || 'secret')


        try{
            const [cuestionarios] = await connection.query(
                `SELECT * FROM cuestionario WHERE nombreUsuario = ?`,
                [infoUsuario.nombreUsuario]
            )
            return cuestionarios
        }catch(e){
            const error = new Error("Error de acceso a la base de datos")
            error.code = 500
            throw error
        }

    }

    static async MiCuestionarioCompleto(token, {inputData}) {
        const idCuestionario = inputData.id
        const infoUsuario = null
        if (!token) {
            const error = new Error("Identificate pasa acceder a tu cuestionarios")
            error.code = 403
            throw error
        }
        try {
            infoUsuario = jwt.verify(token, process.env.JWT_SECRET || 'secret')
        } catch (e) {
            const error = new Error("Identificate pasa acceder a tu cuestionarios")
            error.code = 403
            throw error
        }

        try{
            const [cuestionario] = await connection.query(
                `SELECT * FROM cuestionario WHERE nombreUsuario = ? and idCuestionario = ?`,
                [infoUsuario.nombreUsuario, idCuestionario]
            )
            const [preguntas] = await connection.query(
                `SELECT * FROM pregunta WHERE idCuestionario = ?`,
                [idCuestionario]
            )
            for (const pregunta of preguntas) {
                const [respuestas] = await connection.query(
                    `SELECT contenido, correcta FROM respuesta WHERE idPregunta = ?`,
                    [pregunta.idPregunta]
                )
                pregunta.respuestas = respuestas
            }
            
            return {cuestionario, preguntas}
        }catch(e){
            const error = new Error("Error de acceso a la base de datos")
            error.code = 500
            throw error
        }

    }
    
    static async CompletoPublico({inputData}, token) {
        const idCuestionario = inputData.id

        try {
            const [cuestionarioQuery] = await connection.query(
                `SELECT * FROM cuestionario WHERE idCuestionario = ?`,
                [idCuestionario]
            )
            if (cuestionarioQuery.length === 0) {
                const error = new Error("Cuestionario no encontrado")
                error.code = 404
                throw error
            }
            const cuestionario = cuestionarioQuery[0]

            if (cuestionario.privacidad !== "Publico") {
                
                
                if (!token) {
                    const error = new Error("Este cuestionario no es público, no tienes acceso")
                    error.code = 403
                    throw error
                }
                const infoUsuario = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    
                if(cuestionario.nombreUsuario !== infoUsuario.nombreUsuario){
                    const error = new Error("Este cuestionario no es público, no tienes acceso")
                    error.code = 403
                    throw error
                }
            }

            const [preguntas] = await connection.query(
                `SELECT idPregunta, tipo, tiempo, contenido, puntuacion, puntosSegundo FROM pregunta WHERE idCuestionario = ?`,
                [idCuestionario]
            )

            for (const pregunta of preguntas) {
                const [respuestas] = await connection.query(
                    `SELECT contenido, correcta FROM respuesta WHERE idPregunta = ?`,
                    [pregunta.idPregunta]
                )
                pregunta.respuestas = respuestas
            }
            
            return {cuestionario, preguntas}

        } catch (e) {
            const error = new Error(e.message)
            error.code = 500
            throw error
        }
    }
}