export default function socketHandler(io) {

    let sesionesActivas = []

    io.on('connection', (socket) => {

        socket.on('crearSesion', (idCuestionario) => {
            let codigoSesion
            do{
                codigoSesion = Math.floor(100000 + Math.random() * 900000)
            }  while (sesionesActivas.some(s => s.codigo == codigoSesion))
            
            socket.join(codigoSesion);
            sesionesActivas.push({ codigo: codigoSesion, usuarios: [] , idCuestionario: idCuestionario });
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

                socket.emit('correcto', {idCuestionario: sesion.idCuestionario})
            }
        })
        
        socket.on('iniciarCuestionario', (codigoSesion) => {
            io.to(codigoSesion).emit('iniciarCuestionario');
        })














        socket.on('cerrarSesion', ( codigoSesion) => {
            sesionesActivas = sesionesActivas.filter(s => s.codigo !== codigoSesion);
            io.to(codigoSesion).emit('sesionCerrada');
            io.socketsLeave(codigoSesion);
        })
    })



    
}
