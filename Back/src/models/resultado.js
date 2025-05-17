import connection from '../connection_db/connection.js'
import jwt from 'jsonwebtoken'

export class ResultadoModel {

    static async CreateResultadoCuestionarioIndividual({inputData}) {

        const resultado = inputData.resultadoIndividual

        try {
            const [resQueryResultado] = await connection.query(
                `INSERT INTO resultadoIndividual (idCuestionario, nombreUsuario, fecha, hora, puntuacionFinal)
                 VALUES (?, ?, ?, ?, ?)`,
                [resultado.idCuestionario, resultado.nombreUsuario, resultado.fecha, resultado.hora, resultado.puntuacionFinal]
            )

            for (const pregunta of inputData.preguntasContestadas) {
                const [resQueryPregunta] = await connection.query(
                    `INSERT INTO preguntaContestada (idIndividual, idPregunta, respuesta, tiempo, puntuacion)
                     VALUES (?, ?, ?, ?, ?)`,
                    [resQueryResultado.insertId, pregunta.idPregunta, pregunta.respuesta, pregunta.tiempo, pregunta.puntuacion]
                )
            }
            return {idResultado: resQueryResultado.insertId}
        }
        catch(e){
            const error = new Error("Error de acceso a la base de datos")
            error.code = 500
            throw error
        }
    }

    static async CreateResultadoGrupal({inputData}) {

        const resultado = inputData.resultadoGrupal

        try {
            const [resQueryResultado] = await connection.query(
                `INSERT INTO resultadoGrupal (idCuestionario, fecha, hora)
                 VALUES (?, ?, ?)`,
                [resultado.idCuestionario, resultado.fecha, resultado.hora]
            )
            return {idResultado: resQueryResultado.insertId}
        }
        catch(e){
            const error = new Error("Error de acceso a la base de datos")
            error.code = 500
            throw error
        }
    }

    static async CreateGrupalIndividual({inputData}) {
        const idIndividual = inputData.idIndividual
        const idGrupal = inputData.idGrupal
        try {
            const [resQuery] = await connection.query(
                `INSERT INTO grupalIndividual (idGrupal, idIndividual)
                 VALUES (?, ?)`,
                [idGrupal, idIndividual]
            )
        } catch (e) {
            const error = new Error("Error de acceso a la base de datos")
            error.code = 500
            throw error
        }
    }

    static async GetListaResultadoIndividual(token) {
        const infoUsuario = jwt.verify(token, process.env.JWT_SECRET || 'secret')
        let cuestionarios = []
        
        try {
            const [resultados] = await connection.query(
                `SELECT * FROM resultadoIndividual WHERE nombreUsuario = ? ORDER BY fecha DESC, hora DESC`,
                [infoUsuario.nombreUsuario]
            )
            for(const resultado of resultados){
                const [querycuestionarios] = await connection.query(
                    `SELECT * FROM cuestionario WHERE idCuestionario = ?`,
                    [resultado.idCuestionario]
                )
                cuestionarios.push(querycuestionarios[0])
            }
            return {resultados, cuestionarios}

        } catch (e) {
            const error = new Error("Error de acceso a la base de datos")
            error.code = 500
            throw error
        }
    }

    static async GetResultadoIndividual({inputData}, token) {
        const idResultado = Number(inputData.id);
        const infoUsuario = jwt.verify(token, process.env.JWT_SECRET || 'secret')
        let resultado = null
        let preguntasContestadas = null
        let cuestionario = null
        
        try {
            const [resultadoQuery] = await connection.query(
                `SELECT * FROM resultadoIndividual WHERE idIndividual = ?`,
                [idResultado]
            )
            resultado = resultadoQuery[0]
        } catch (e) {
            const error = new Error("Error de acceso a la base de datos")
            error.code = 500
            throw error
        }
        if (resultado.length === 0) {
            const error = new Error("No existe el resultado")
            error.code = 404
            throw error
        }
        
        if(resultado.nombreUsuario !== infoUsuario.nombreUsuario){
            const error = new Error("No tienes acceso a este resultado")
            error.code = 403
            throw error
        }
        try {
            
            const [preguntasContestadasQuery] = await connection.query(
                `SELECT * FROM preguntaContestada WHERE idIndividual = ?`,
                [idResultado]
            )

            const [cuestionarioQuery] = await connection.query(
                `SELECT * FROM cuestionario WHERE idCuestionario = ?`,
                [resultado.idCuestionario]
            )

            preguntasContestadas = preguntasContestadasQuery
            cuestionario = cuestionarioQuery [0]

            for (const preguntaContestada of preguntasContestadas) {
                // Obtener info de la pregunta
                const [preguntaCompleta] = await connection.query(
                    `SELECT * FROM pregunta WHERE idPregunta = ?`,
                    [preguntaContestada.idPregunta]
                );
                preguntaContestada.pregunta = preguntaCompleta[0];
            
                const [respuestas] = await connection.query(
                    `SELECT * FROM respuesta WHERE idPregunta = ?`,
                    [preguntaContestada.idPregunta]
                );
                preguntaContestada.pregunta.respuestas = respuestas;
            }

            return {resultado, cuestionario, preguntasContestadas}
            
        } catch (e) {
            const error = new Error(e.message)
            error.code = 500
            throw error
        }
        

        
    }
}