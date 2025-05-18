import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { ResultadoGrupal } from '../../interfaces/resultado';

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

  crearSesion(cuestionario:any, preguntas:any): Observable<any> {
    this.socket.emit('crearSesion',cuestionario, preguntas);
    return new Observable(observer => {
      this.socket.once('sesionCreada', (data) => {
        observer.next(data); 
        observer.complete();              
      })
    })
  }

  unirseSesion(codigoSesion: number, usuario: string): Observable<any> {
    this.socket.emit('unirseSesion', { codigoSesion, usuario })
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


  enviarRespuesta(codigoSesion:number){
    this.socket.emit('enviarRespuesta', codigoSesion);
  }

  onceEscucharRespuestas(): Observable<void> {
    return new Observable(observer => {
      this.socket.once('todasRecibidas', () => {
        observer.next();
        observer.complete();
      });
    });
  }

  siguientePregunta(codigoSesion: number){
    this.socket.emit('siguientePregunta', codigoSesion);
  }

  onceEscucharSiguientePregunta(): Observable<void> {
    return new Observable(observer => {
      this.socket.once('siguientePregunta', () => {
        observer.next();
        observer.complete();
      });
    });
  }

  finalizarCuestionario(codigoSesion: number, resultadoGrupal: ResultadoGrupal) {
    this.socket.emit('finalCuestionario',codigoSesion, resultadoGrupal);
  }
  
  onceFinalCuestionario(): Observable<any> {
    return new Observable(observer => {
      this.socket.once('escucharFinalCuestionario', (data) => {
        observer.next(data);
        observer.complete();
      });
    });
  }

  enviarRanking(codigoSesion: number, ranking: any) {
    this.socket.emit('enviarRanking', codigoSesion, ranking);
  }

  onceEscucharRanking(): Observable<any> {
    return new Observable(observer => {
      this.socket.once('recibirRanking', (data) => {
        observer.next(data);
        observer.complete();
      });
    });
  }

  cerrarSesion(codigoSesion: number) {
    this.socket.emit('cerrarSesion', codigoSesion);
  }

  onceCerrarSesion(): Observable<void> {
    return new Observable(observer => {
      this.socket.once('sesionCerrada', () => {
      observer.next();  
      observer.complete(); 
      });
    });
  }
  
  salirSesion(codigoSesion: number) {
    this.socket.emit('salirSesion', codigoSesion);
  }
}
