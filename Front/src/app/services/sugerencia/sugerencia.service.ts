import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class SugerenciaService {
  private apiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { }
    crear(sugerencia: any) : Observable<any> {
      return this.http.post(`${this.apiUrl}/sugerencias/crear` , {sugerencia}).pipe(
        catchError(error => {
          const mensajeError= error.error?.Error || 'Error desconocido al guardar la sugerencia';
          return throwError(() => new Error(mensajeError))
        })
      )
    }
}
