import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket
  constructor() {
    this.socket = io('http://localhost:3000', {
      withCredentials: true
    });
  }

  crearSesion(idCuestionario:number): Observable<any> {
    return new Observable(observer => {
      this.socket.emit('crearSesion', idCuestionario);

      this.socket.once('sesionCreada', (data) => {
        observer.next(data); 
        observer.complete();              
      })
    })
  }

  onActualizarParticipantes(): Observable<any> {
    
    return new Observable(observer => {
      this.socket.on('actualizarParticipantes', (data) => {
        observer.next(data);
      });
    });
  }
  

  probarCodigo(codigoSesion:number){
    this.socket.emit('probarCodigo', codigoSesion);
    return new Observable(observer => {
      this.socket.once('codigoCorrecto', data => {observer.next(data), observer.complete()})
      this.socket.on('errorCodigo', () => {
        observer.error(new Error("El código de la sesión no es correcto"));
      });
    });
  }

  unirseSesion(codigoSesion: number, usuario: string): Observable<any> {
    this.socket.emit('unirseSesion', { codigoSesion, usuario });
    return new Observable(observer => {
      this.socket.once('correcto', (data) => {
        observer.next(data)
        observer.complete()
      })
      this.socket.on('errorUsuario', (data) => {
        observer.error(new Error(data.mensaje));
      })
    })
  }

  iniciarCuestionario(codigoSesion: number) {
    this.socket.emit('iniciarCuestionario', codigoSesion);
  }

  onIniciarCuestionario(): Observable<void> {
    return new Observable(observer => {
      this.socket.once('iniciarCuestionario', () => {
        observer.next();
        observer.complete();
      });
    });
  }

  cerrarSesion(codigoSesion: number) {
    this.socket.emit('cerrarSesion', codigoSesion);
  }

  onCerrarSesion(): Observable<void> {
    return new Observable(observer => {
      this.socket.once('sesionCerrada', () => {
      observer.next();  
      observer.complete(); 
      });
    });
  }
}
