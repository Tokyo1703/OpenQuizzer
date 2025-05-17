export interface ResultadoIndividual{
    idCuestionario: number,
    nombreUsuario: string,
    fecha:string,
    hora:string,
    puntuacionFinal: number
}
export interface ResultadoIndividualRecibido extends ResultadoIndividual{
    idIndividual: number,

}
export interface ResultadoGrupal{
    idResultadoGrupal: number,
    idCuestionario: number,
    fecha:string,
    hora:string
}

