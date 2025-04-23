import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../interfaces/usuario';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  private apiUrl = 'http://localhost:3000'
  constructor(private http: HttpClient) { }

  registrarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/crear` , usuario, {withCredentials: true}).pipe(
      catchError(error => {
        
        const errorMsg = error.error?.Error || 'Error desconocido al registrar';
        return throwError(() => new Error(errorMsg))
      })
    )
  }

  login(nombreUsuario: String, contrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/login` , { nombreUsuario, contrasena }, {withCredentials: true}).pipe(
      catchError(error => {
        
        const mensajeError = error.error?.Error || 'Error desconocido en el login';
        return throwError(() => new Error(mensajeError))
      })
    )
  }

  getPerfil(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/perfil`, {withCredentials: true}).pipe(
      catchError(error => {
        const mensajeError = error.error?.Error || 'Error desconocido de autenticación';
        return throwError(() => new Error(mensajeError))
      })
    )
  }
}

