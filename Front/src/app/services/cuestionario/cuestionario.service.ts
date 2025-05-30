import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class CuestionarioService {
  private apiUrl = 'http://localhost:3000'
  constructor(private http: HttpClient) { }

  crearCuestionario(cuestionario: any, preguntas: any[] ): Observable<any> {
    return this.http.post(`${this.apiUrl}/cuestionarios/crear` , {cuestionario, preguntas}, {withCredentials: true}).pipe(
      catchError(error => {
        
        const mensajeError= error.error?.Error || 'Error desconocido al guardar el cuestionario';
        return throwError(() => new Error(mensajeError))
      })
    )
  }

  borrarCuestionario(idCuestionario: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cuestionarios/borrar/${idCuestionario}`, {withCredentials: true}).pipe(
      catchError(error => {
        const mensajeError= error.error?.Error || 'Error desconocido al borrar el cuestionario';
        return throwError(() => new Error(mensajeError))
      })
    )
  }

  modificarCuestionario(cuestionario: any, preguntas: any[] ): Observable<any> {
    return this.http.put(`${this.apiUrl}/cuestionarios/modificar` , {cuestionario, preguntas}, {withCredentials: true}).pipe(
      catchError(error => {
        const mensajeError= error.error?.Error || 'Error desconocido al modificar el cuestionario';
        return throwError(() => new Error(mensajeError))
      })
    )
  }

  getCuestionariosPublicos(): Observable<any>  {
    return this.http.get(`${this.apiUrl}/cuestionarios/publicos`).pipe(
      catchError(error => {
        const mensajeError= error.error?.Error || 'Error desconocido al obtener los cuestionarios';
        return throwError(() => new Error(mensajeError))
      })
    )
  }

  getCuestionarioCompleto(idCuestionario: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cuestionarios/completoPublico/${idCuestionario}`).pipe(
      catchError(error => {
        const mensajeError= error.error?.Error || 'Error desconocido al obtener el cuestionario';
        return throwError(() => new Error(mensajeError))
      })
    )
  }
  
  getMiCuestionarioCompleto(idCuestionario: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cuestionarios/completo/${idCuestionario}`, {withCredentials: true}).pipe(
      catchError(error => {
        const mensajeError= error.error?.Error || 'Error desconocido al obtener el cuestionario';
        return throwError(() => new Error(mensajeError))
      })
    )
  }

  getMisCuestionarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cuestionarios/misCuestionarios`,{withCredentials: true}).pipe(
      catchError(error => {
        const mensajeError= error.error?.Error || 'Error desconocido al obtener los cuestionarios';
        return throwError(() => new Error(mensajeError))
      })
    )
  }

}
