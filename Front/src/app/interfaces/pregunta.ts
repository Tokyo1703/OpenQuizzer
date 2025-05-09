export interface Respuesta {
    contenido: string
    correcta: string
}

export interface Pregunta {
    tipo: string
    contenido: string
    tiempo: number
    puntuacion: number
    puntosSegundo: number
    respuestas: Respuesta[]
}
export interface PreguntaRecibidadBackend extends Pregunta {
    idPregunta: number;
  }

export interface PreguntaContestada{
    idPregunta: number,
    respuesta: string,
    tiempo: number,
    puntuacion: number
}

export interface PreguntaContestadaCompleta extends PreguntaContestada{
    pregunta: PreguntaRecibidadBackend
}