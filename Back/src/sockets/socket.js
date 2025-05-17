export default function socketHandler(io) {

    let sesionesActivas = []

    io.on('connection', (socket) => {

        socket.on('crearSesion', (cuestionario,preguntas) => {
            let codigoSesion
            do{
                codigoSesion = Math.floor(100000 + Math.random() * 900000)
            }  while (sesionesActivas.some(s => s.codigo == codigoSesion))
            
            socket.join(codigoSesion);
            sesionesActivas.push({ codigo: codigoSesion, usuarios: [] , cuestionario, preguntas, respuestasRecibidas: 0})
            io.to(codigoSesion).emit('sesionCreada', {codigoSesion});
        })

        
        socket.on('probarCodigo', (codigoSesion) => {     
            if (sesionesActivas.find(s => s.codigo == codigoSesion)) {
                socket.emit('codigoCorrecto');
            } else {
                socket.emit('errorCodigo');
            }
        })

        socket.on('unirseSesion', ({ codigoSesion, usuario }) => {
            const sesion = sesionesActivas.find(s => s.codigo == codigoSesion);
            if (sesion.usuarios.includes(usuario)) {
                socket.emit('errorUsuario', { mensaje: 'Ya existe un usuario con este nombre en la sesión' });
            } else {
                sesion.usuarios.push(usuario);
                socket.join(codigoSesion);

  
                io.to(codigoSesion).emit('actualizarParticipantes', {
                    numeroParticipantes: sesion.usuarios.length,
                    participantes: sesion.usuarios
                });

                socket.emit('correcto', {cuestionario: sesion.cuestionario, preguntas: sesion.preguntas});
            }
        })
        
        socket.on('iniciarCuestionario', (codigoSesion) => {
            io.to(codigoSesion).emit('iniciarCuestionario');
        })

        socket.on('enviarRespuesta', (codigoSesion) => {
            const sesion = sesionesActivas.find(s => s.codigo == codigoSesion);
            sesion.respuestasRecibidas +=1
            if (sesion.respuestasRecibidas == sesion.usuarios.length) {
                io.to(codigoSesion).emit('todasRecibidas');
                sesion.respuestasRecibidas = 0;
            }
        })

        socket.on('siguientePregunta', (codigoSesion) => {
            io.to(codigoSesion).emit('siguientePregunta');
        })

        socket.on('finalCuestionario', (codigoSesion,resultadoGrupal) => {
            io.to(codigoSesion).emit('escucharFinalCuestionario', {resultadoGrupal:resultadoGrupal});
        })

        socket.on('cerrarSesion', ( codigoSesion) => {
            sesionesActivas = sesionesActivas.filter(s => s.codigo !== codigoSesion);
            io.to(codigoSesion).emit('sesionCerrada');
            io.socketsLeave(codigoSesion);
        })

        socket.on('salirSesion', (codigoSesion) => {
            socket.leave(codigoSesion);
        })
    })
}
