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

    static async Modificar({inputData},token) {
        const cuestionario = inputData.cuestionario
        const preguntas = inputData.preguntas
        const infoUsuario = jwt.verify(token, process.env.JWT_SECRET || 'secret')

        if(cuestionario.nombreUsuario !== infoUsuario.nombreUsuario){
            const error = new Error("No tienes permiso para modificar este cuestionario")
            error.code = 403
            throw error
        }

        try {
            await connection.query(
                `UPDATE cuestionario SET nombre = ?, descripcion = ?, privacidad = ? WHERE idCuestionario = ?`,
                [cuestionario.nombre, cuestionario.descripcion, cuestionario.privacidad, cuestionario.idCuestionario]
            )

            const [preguntasExistentes] = await connection.query(
                `SELECT idPregunta FROM pregunta WHERE idCuestionario = ?`,
                [cuestionario.idCuestionario]
            );
            const idsExistentes = preguntasExistentes.map(pregunta => pregunta.idPregunta)
            const idsNuevos = preguntas.map(pregunta => pregunta.idPregunta).filter(id => id)
            
            const idsParaEliminar = idsExistentes.filter(id => !idsNuevos.includes(id))
            for (const id of idsParaEliminar) {
                await connection.query(`DELETE FROM respuesta WHERE idPregunta = ?`, [id])
                await connection.query(`DELETE FROM pregunta WHERE idPregunta = ?`, [id])
            }

            for (const pregunta of preguntas) {
                let idPreguntaActualizada = pregunta.idPregunta

                if (!idPreguntaActualizada) {
                    const [resQuery] = await connection.query(
                        `INSERT INTO pregunta (idCuestionario, tipo, tiempo, contenido, puntuacion, puntosSegundo)
                        VALUES (?, ?, ?, ?, ?, ?)`,
                        [cuestionario.idCuestionario, pregunta.tipo, pregunta.tiempo, pregunta.contenido, pregunta.puntuacion, pregunta.puntosSegundo]
                    )
                    idPreguntaActualizada = resQuery.insertId
                } else {
                    await connection.query(
                        `UPDATE pregunta SET tipo = ?, tiempo = ?, contenido = ?, puntuacion = ?, puntosSegundo = ? WHERE idPregunta = ?`,
                        [pregunta.tipo, pregunta.tiempo, pregunta.contenido, pregunta.puntuacion, pregunta.puntosSegundo, idPreguntaActualizada]
                    );
                }

                const [respuestasExistentes] = await connection.query(
                    `SELECT idRespuesta FROM respuesta WHERE idPregunta = ?`,
                    [idPreguntaActualizada]
                );
                const idsRespuestasExistentes = respuestasExistentes.map(respuesta => respuesta.idRespuesta);
                const idsRespuestasNuevas = pregunta.respuestas.map(respuesta => respuesta.idRespuesta).filter(id => id);
                
                const respuestasParaEliminar = idsRespuestasExistentes.filter(id => !idsRespuestasNuevas.includes(id));

                for (const id of respuestasParaEliminar) {
                    await connection.query(`DELETE FROM respuesta WHERE idRespuesta = ?`, [id]);
                }

                for (const respuesta of pregunta.respuestas) {
                    if (respuesta.idRespuesta) {
                        await connection.query(
                            `UPDATE respuesta SET contenido = ?, correcta = ? WHERE idRespuesta = ?`,
                            [respuesta.contenido, respuesta.correcta, respuesta.idRespuesta]
                        );
                    }else{
                        
                        await connection.query(
                        `INSERT INTO respuesta (idPregunta, contenido, correcta) VALUES (?, ?, ?)`,
                        [idPreguntaActualizada, respuesta.contenido, respuesta.correcta]
                        )
                    
                    }
                }
            }

        } catch (e) {
            const error = new Error("Error de acceso a la base de datos")
            error.code = 500
            throw error
        }
    }

    static async Borrar({inputData}, token) {
        const idCuestionario = inputData.id
        const infoUsuario = jwt.verify(token, process.env.JWT_SECRET || 'secret')
        let cuestionario = null
    
        try {
            const [cuestionarioQuery] = await connection.query(
                `SELECT * FROM cuestionario WHERE idCuestionario = ?`,
                [idCuestionario]
            )
            cuestionario = cuestionarioQuery[0]
        }
        catch (e) {
            const error = new Error("Error de acceso a la base de datos")
            error.code = 500
            throw error
        }
        if (cuestionario.length === 0) {
            const error = new Error("Cuestionario no encontrado")
            error.code = 404
            throw error
        }
        if (cuestionario.nombreUsuario !== infoUsuario.nombreUsuario) {
            const error = new Error("No tienes permiso para borrar este cuestionario")
            error.code = 403
            throw error
        }
        try{
            
            await connection.query(
                `DELETE FROM respuesta WHERE idPregunta IN (SELECT idPregunta FROM pregunta WHERE idCuestionario = ?)`,
                [idCuestionario]
            )
            await connection.query(
                `DELETE FROM preguntaContestada WHERE idPregunta IN (SELECT idPregunta FROM pregunta WHERE idCuestionario = ?)`,
                [idCuestionario]
            )
            await connection.query(
                `DELETE FROM grupalIndividual where idGrupal IN (SELECT idGrupal FROM resultadoGrupal WHERE idCuestionario = ?)`,
                [idCuestionario]
            )
            await connection.query(
                `DELETE FROM resultadoGrupal WHERE idCuestionario = ?`,
                [idCuestionario]
            )
            await connection.query(
                `DELETE FROM resultadoIndividual WHERE idCuestionario = ?`,
                [idCuestionario]
            )
            await connection.query(
                `DELETE FROM pregunta WHERE idCuestionario = ?`,
                [idCuestionario]
            )
            await connection.query(
                `DELETE FROM cuestionario WHERE idCuestionario = ?`,
                [idCuestionario]
            )
        } catch (e) {
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

    static async MiCuestionarioCompleto({inputData}, token) {
        const idCuestionario = inputData.id
        const infoUsuario = jwt.verify(token, process.env.JWT_SECRET|| 'secret')

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
    
            if(cuestionario.nombreUsuario !== infoUsuario.nombreUsuario){
                const error = new Error("Este cuestionario no es público, no tienes acceso")
                error.code = 403
                throw error
            }

            const [preguntas] = await connection.query(
                `SELECT idPregunta, tipo, tiempo, contenido, puntuacion, puntosSegundo FROM pregunta WHERE idCuestionario = ?`,
                [idCuestionario]
            )

            for (const pregunta of preguntas) {
                const [respuestas] = await connection.query(
                    `SELECT * FROM respuesta WHERE idPregunta = ?`,
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