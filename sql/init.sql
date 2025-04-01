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
    constraint ck_privacidad CHECK (privacidad in ('Público','Privado')),
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
    
    constraint ck_tipo CHECK (tipo in ('VerdaderoFalso','RespuestaAbierta','OpcionMúltiple','OpcionÚnica')),
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
    constraint fk_IndividualCuestionario foreign key (idCuestionario) references cuestionario(idCuestionario),
    constraint fk_IndividualUsuario foreign key (nombreUsuario) references usuario(nombreUsuario)
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