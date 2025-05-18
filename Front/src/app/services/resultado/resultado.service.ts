import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResultadoGrupal, ResultadoIndividual } from '../../interfaces/resultado';
import { PreguntaContestada } from '../../interfaces/pregunta';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ResultadoService {
  private apiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  guardarResultadoCuestionarioIndividual(resultadoIndividual: ResultadoIndividual, preguntasContestadas: PreguntaContestada[]) : Observable<any> {
    return this.http.post(`${this.apiUrl}/resultados/crearResultadoCuestionarioIndividual` , {resultadoIndividual, preguntasContestadas}).pipe(
      catchError(error => {
        const mensajeError= error.error?.Error || 'Error desconocido al guardar el resultado';
        return throwError(() => new Error(mensajeError))
      })
    )
  }

  guardarResultadoGrupal(resultadoGrupal: ResultadoGrupal): Observable<any> {
    return this.http.post(`${this.apiUrl}/resultados/crearResultadoGrupal`, {resultadoGrupal}, {withCredentials: true}).pipe(
      catchError(error => {
        const mensajeError= error.error?.Error || 'Error desconocido al guardar el resultado';
        return throwError(() => new Error(mensajeError))
      })
    )
  }
  
  guardarGrupalIndividual(idGrupal: number, idIndividual: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/resultados/crearGrupalIndividual`, {idGrupal, idIndividual}).pipe(
      catchError(error => {
        const mensajeError= error.error?.Error || 'Error desconocido al guardar el resultado';
        return throwError(() => new Error(mensajeError))
      })
    )
  }

  getResultadosGrupales(): Observable<any> {
    return this.http.get(`${this.apiUrl}/resultados/getResultadosGrupales/`, {withCredentials: true}).pipe(
      catchError(error => {
        const mensajeError= error.error?.Error || 'Error desconocido al obtener los resultados';
        return throwError(() => new Error(mensajeError))
      })
    )
  }

  getResultadosIndividuales(): Observable<any> {
    return this.http.get(`${this.apiUrl}/resultados/getResultadosIndividuales/`, {withCredentials: true}).pipe(
      catchError(error => {
        const mensajeError= error.error?.Error || 'Error desconocido al obtener los resultados';
        return throwError(() => new Error(mensajeError))
      })
    )
  }


  getResultadoIndividual(idResultado: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/resultados/getResultadoIndividual/${idResultado}`, {withCredentials: true}).pipe(
      catchError(error => {
        const mensajeError= error.error?.Error || 'Error desconocido al obtener el resultado';
        return throwError(() => new Error(mensajeError))
      })
    )
  }

  getResultadoGrupal(idResultado: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/resultados/getResultadoGrupal/${idResultado}`, {withCredentials: true}).pipe(
      catchError(error => {
        const mensajeError= error.error?.Error || 'Error desconocido al obtener el resultado';
        return throwError(() => new Error(mensajeError))
      })
    )
  }

  getRanking(idResultado: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/resultados/getRanking/${idResultado}`, {withCredentials: true}).pipe(
      catchError(error => {
        const mensajeError= error.error?.Error || 'Error desconocido al obtener el resultado';
        return throwError(() => new Error(mensajeError))
      })
    )
  }
  
}
