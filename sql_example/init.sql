/*
    OpenQuizzer  © 2025 by Carla Bravo Maestre is licensed under CC BY 4.0.
    To view a copy of this license, visit https://creativecommons.org/licenses/by/4.0/
*/
create database if not exists OpenQuizzerDataBase;

use OpenQuizzerDataBase;

drop table if exists preguntaContestada;
drop table if exists grupalIndividual;
drop table if exists resultadoIndividual;
drop table if exists resultadoGrupal;
drop table if exists respuesta;
drop table if exists pregunta;
drop table if exists cuestionario;
drop table if exists usuario;
drop table if exists sugerencia;

create table if not exists usuario(
	nombreUsuario varchar(64) primary key,
    nombre varchar(128) not null, 
    apellidos varchar(128) not null,
    correo varchar(128) unique not null, 
    contrasena varchar(255) not null,
    rol varchar(64) not null,
    constraint ck_rol CHECK (rol in ('Participante','Creador'))	
);


create table if not exists cuestionario(
	idCuestionario int auto_increment primary key,
    nombreUsuario varchar(128) not null, 
    nombre varchar(128) not null,
    descripcion varchar(255), 
    privacidad varchar(255) not null,
    constraint ck_privacidad CHECK (privacidad in ('Publico','Privado')),
    constraint fk_UsuarioCuestionario foreign key (nombreUsuario) references usuario(nombreUsuario)
);

create table if not exists pregunta(
	idPregunta int auto_increment primary key,
    idCuestionario int not null, 
    tipo varchar(128) not null,
    tiempo int not null,
    contenido varchar(255) not null,
    puntuacion int not null,
    puntosSegundo int not null,
    
    constraint ck_tipo CHECK (tipo in ('VerdaderoFalso','RespuestaAbierta','OpcionMultiple','OpcionUnica')),
    constraint fk_PreguntaCuestionario foreign key (idCuestionario) references cuestionario(idCuestionario)
);

create table if not exists respuesta(
	idRespuesta int auto_increment primary key,
    idPregunta int not null,
    contenido varchar(255) not null,
    correcta varchar(255) not null,

    constraint ck_correcta CHECK (correcta in ('Correcta','Falsa')),
    constraint fk_RespuestaPregunta foreign key (idPregunta) references pregunta(idPregunta)
);

create table if not exists resultadoGrupal(
    idGrupal int auto_increment primary key,
    idCuestionario int not null,
    fecha date not null,
    hora time not null,

    constraint fk_GrupalCuestionario foreign key (idCuestionario) references cuestionario(idCuestionario)
);

create table if not exists resultadoIndividual(
    idIndividual int auto_increment primary key,
    idCuestionario int not null,
    nombreUsuario varchar(128) not null,
    fecha date not null,
    hora time not null,
    puntuacionFinal int not null,
    constraint fk_IndividualCuestionario foreign key (idCuestionario) references cuestionario(idCuestionario)
);

create table if not exists grupalIndividual(
    idGrupal int not null,
    idIndividual int not null,
    primary key (idGrupal, idIndividual),
    constraint fk_GrupalIndividual foreign key (idGrupal) references resultadoGrupal(idGrupal),
    constraint fk_IndividualGrupal foreign key (idIndividual) references resultadoIndividual(idIndividual)
);

create table if not exists preguntaContestada(
    idContestada int auto_increment primary key,
    idIndividual int not null,
    idPregunta int not null,
    respuesta varchar(255),
    tiempo int not null,
    puntuacion int not null,
    constraint fk_ContestadaIndividual foreign key (idIndividual) references resultadoIndividual(idIndividual),
    constraint fk_ContestadaPregunta foreign key (idPregunta) references pregunta(idPregunta)
);

create table if not exists sugerencia(
    idSugerencia int auto_increment primary key,
    nombreCompleto varchar(128) not null,
    correo varchar(255) not null,
    contenido varchar(255) not null
);


INSERT INTO usuario (nombreUsuario, nombre, apellidos, correo, contrasena, rol) VALUES
('CarlaCreadora', 'Carla', 'Bravo Maestre', 'carlac@gmail.com', '$2b$10$cFliIftB.NcjHZsp0QSqJOKe9Atcds9PNRY1cvbhHxbPQieRmQvE.', 'Creador'),
('CarlaParticipante', 'Carla', 'Bravo Maestre', 'carlap@gmail.com', '$2b$10$Hu6LGnPKx4mfhumVE35G9OVf82qvEbHmVft4K2nMJIBfotmDFoW8m', 'Participante');

INSERT INTO cuestionario (nombreUsuario, nombre, descripcion, privacidad) VALUES
('CarlaCreadora', 'Informatica - Tema 1', 'Cuestionario del primer tema de la asignatura de informatica de 2 de Bachillerato, del instituto IES Maimonides, para la clase A.', 'Publico'),
('CarlaCreadora', 'Biologia 1 ESO - Tema 1', 'Cuestionario del tema 1 de la asignatura de Biologia para el curso 1 ESO, clase A, del instituto IES Maimonides.', 'Publico');

INSERT INTO pregunta (idCuestionario, tipo, tiempo, contenido, puntuacion, puntosSegundo) VALUES
(1, 'OpcionMultiple', 20, 'Para que sirve la memoria RAM?', 100, 2),
(1, 'OpcionUnica', 20, 'Que es una red LAN?', 100, 2),
(1, 'VerdaderoFalso', 20, 'La direccion IP es el numero de serie del disco duro?', 100, 2),
(1, 'OpcionMultiple', 15, 'Cual/es de estos componentes pertenecen al hardware de una computadora?', 120, 2),
(2, 'VerdaderoFalso', 20, 'Los seres vivos estan formados por celulas', 100, 1),
(2, 'RespuestaAbierta', 22, 'En que parte del cuerpo se encuentra el cerebro?', 100, 1),
(2, 'OpcionMultiple', 22, 'Cuales de los siguientes son seres vivos?', 100, 1),
(2, 'OpcionUnica', 20, 'Que necesitan las plantas para hacer la fotosintesis?', 120, 2);

INSERT INTO respuesta (idPregunta, contenido, correcta) VALUES
(1, 'Guardar fotos permanentemente', 'Falsa'),
(1, 'Almacenar temporalmente datos de procesos en ejecucion', 'Correcta'),
(1, 'Reproducir sonido', 'Falsa'),
(1, 'Navegar por Internet', 'Falsa');

INSERT INTO respuesta (idPregunta, contenido, correcta) VALUES
(2, 'Una red global como Internet', 'Falsa'),
(2, 'Una red local de dispositivos interconectados', 'Correcta'),
(2, 'Un sistema de respaldo de datos', 'Falsa'),
(2, 'Un antivirus de codigo abierto', 'Falsa');

INSERT INTO respuesta (idPregunta, contenido, correcta) VALUES
(3, 'Si', 'Falsa'),
(3, 'No', 'Correcta');

INSERT INTO respuesta (idPregunta, contenido, correcta) VALUES
(4, 'Disco duro', 'Correcta'),
(4, 'Sistema operativo', 'Falsa'),
(4, 'Memoria RAM', 'Correcta'),
(4, 'Monitor', 'Correcta'),
(4, 'Antivirus', 'Falsa'),
(4, 'CPU', 'Correcta');

INSERT INTO respuesta (idPregunta, contenido, correcta) VALUES
(5, 'Verdadero', 'Correcta'),
(5, 'Falso', 'Falsa');

INSERT INTO respuesta (idPregunta, contenido, correcta) VALUES
(6, 'Cabeza', 'Correcta'),
(6, 'Craneo', 'Correcta');

INSERT INTO respuesta (idPregunta, contenido, correcta) VALUES
(7, 'Arbol', 'Correcta'),
(7, 'Roca', 'Falsa'),
(7, 'Perro', 'Correcta'),
(7, 'Hongo', 'Correcta');

INSERT INTO respuesta (idPregunta, contenido, correcta) VALUES
(8, 'Agua, oxigeno y sombra', 'Falsa'),
(8, 'Luz solar, agua y dioxido de carbono', 'Correcta'),
(8, 'Tierra, sal y aire', 'Falsa'),
(8, 'Fuego, aire y agua', 'Falsa');
