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