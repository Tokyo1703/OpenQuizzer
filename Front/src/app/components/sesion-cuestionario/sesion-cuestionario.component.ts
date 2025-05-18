import { Component, OnInit} from '@angular/core';
import { SocketService } from '../../services/socket/socket.service';
import { CuestionarioService } from '../../services/cuestionario/cuestionario.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cuestionario } from '../../interfaces/cuestionario';
import { PreguntaRecibidaBackend, PreguntaContestada } from '../../interfaces/pregunta';
import { ResultadoGrupal, ResultadoIndividual } from '../../interfaces/resultado';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { ResultadoService } from '../../services/resultado/resultado.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sesion-cuestionario',
  imports: [FormsModule],
  templateUrl: './sesion-cuestionario.component.html',
  styleUrl: './sesion-cuestionario.component.css'
})
export class SesionCuestionarioComponent implements OnInit {

  paso: string = "IngresarNombre"
  cuestionario: Cuestionario = {
    nombreUsuario: '',
    idCuestionario: -1,
    nombre: '',
    descripcion: '',
    privacidad: ''
  }
  preguntas: PreguntaRecibidaBackend[] = []
  preguntasContestadas: PreguntaContestada[] = []
  nuevaPreguntaContestada: PreguntaContestada = {
    idPregunta: -1,
    respuesta: '',
    tiempo: 0,
    puntuacion: 0
  }
  resultadoIndividual: ResultadoIndividual = {
    idCuestionario: -1,
    nombreUsuario: '',
    fecha: '',
    hora: '',
    puntuacionFinal: 0
  }
  idResultadoIndividual: number = 0
  resultadoGrupal: ResultadoGrupal = {
    idGrupal: -1,
    idCuestionario: -1,
    fecha: '',
    hora: ''
  }
  ranking: ResultadoIndividual[] = [];

  numeroParticipantes: number = 0;
  numeroPregunta:number=-1;
  participantes: string[] = [];
  codigoSesion: number = 0
  nombreUsuario: string = ''

  tiempoRestante: number = 0
  intervaloControlador: any = null
  timeOutControlador: any = null


  constructor(private socketService: SocketService, private route: ActivatedRoute, private router: Router,
  private usuarioService: UsuarioService, private toastr: ToastrService, private resultadoService: ResultadoService){
     this.socketService.onceFinalCuestionario().subscribe( {
      next: (data) => {
        this.resultadoGrupal = data.resultadoGrupal
        this.finalCuestionario()
      },
      error: (e) => {
        this.toastr.error(e.message,"Error",{timeOut: 8000, closeButton: true});
      }
      
    })
    
    this.socketService.onceCerrarSesion().subscribe(() => {
      this.toastr.info('La sesión ha sido cerrada por el creador', 'Saliste', {timeOut: 8000, closeButton: true})
      this.router.navigate(['/']);
    })          
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.codigoSesion= Number(params.get('codigo'));
    });

    this.socketService.probarCodigo(Number(this.codigoSesion)).subscribe({
      next: () => {
        this.toastr.success('Introduce tu nombre para unirte a la sala', 'Código correcto',{timeOut: 8000, closeButton: true} )
      },
      error: (err) => {
        this.toastr.error(err.message, 'Error', {timeOut: 8000,closeButton: true})
        this.router.navigate(['/']);
      }
    })

    

    this.usuarioService.getPerfil().subscribe({
      next: (res) => {
        this.nombreUsuario = res.perfil.nombreUsuario;
      },
      error: (e) => {
      }
    })

    this.socketService.onActualizarParticipantes().subscribe(data => {
      this.numeroParticipantes = data.numeroParticipantes;
      this.participantes = data.participantes;
    })

    this.socketService.onIniciarCuestionario().subscribe(() => {
      this.iniciarCuestionario()

    })
    
   
  }

  unirseSesion() {
    this.socketService.unirseSesion(this.codigoSesion, this.nombreUsuario).subscribe({
      next: (data) => {
        this.cuestionario = data.cuestionario;
        this.preguntas = data.preguntas;
        this.toastr.success('Te has unido a la sesión correctamente', 'Correcto', {timeOut: 8000, closeButton: true});
        this.paso="SalaEspera"
      },
      error: (e) => {
        this.toastr.error(e.message,"Error",{timeOut: 8000, closeButton: true});
      }
    });  
  }


  iniciarCuestionario(){
    this.paso="InicioCuestionario"
    this.tiempoRestante=4
    this.intervaloControlador = setInterval(() => {
      this.tiempoRestante--;
        if (this.tiempoRestante <= 0) {
          this.cuentaAtras()
        }
      }, 1000)
  }

  cuentaAtras(){
    clearInterval(this.intervaloControlador)
    this.paso="CuentaAtras"
    this.tiempoRestante=3
    this.intervaloControlador = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        this.iniciarPregunta()
      }
    }, 1000)
  }

  iniciarPregunta(){
    clearInterval(this.intervaloControlador)
    this.numeroPregunta++;
    this.paso="Pregunta"

    this.tiempoRestante = this.preguntas[this.numeroPregunta].tiempo;
    this.intervaloControlador = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        this.finPregunta()
      }
    }, 1000)
  }

  
  guardarRespuesta(contenido: string) {
    if(contenido !== undefined){
      this.nuevaPreguntaContestada.respuesta = contenido
    }
    this.finPregunta()
  }


  finPregunta(){
    clearInterval(this.intervaloControlador)
    this.paso="EsperandoRespuestas"
    
    let puntuacion=0
    if(this.preguntas[this.numeroPregunta].tipo == "RespuestaAbierta"){      
      for(let i = 0; i < this.preguntas[this.numeroPregunta].respuestas.length; i++){
        if(this.preguntas[this.numeroPregunta].respuestas[i].contenido == this.nuevaPreguntaContestada.respuesta){
          puntuacion = this.preguntas[this.numeroPregunta].puntuacion
          puntuacion = puntuacion + this.preguntas[this.numeroPregunta].puntosSegundo * this.tiempoRestante
          break
        }
      }
    }
    else{
      for(let i = 0; i < this.preguntas[this.numeroPregunta].respuestas.length; i++){
        if(this.preguntas[this.numeroPregunta].respuestas[i].correcta == "Correcta"){
          if(this.nuevaPreguntaContestada.respuesta == this.preguntas[this.numeroPregunta].respuestas[i].contenido){
            puntuacion = this.preguntas[this.numeroPregunta].puntuacion
            puntuacion = puntuacion + this.preguntas[this.numeroPregunta].puntosSegundo * this.tiempoRestante
            break
          }
        }
      }
    }

    this.nuevaPreguntaContestada.idPregunta = this.preguntas[this.numeroPregunta].idPregunta
    this.nuevaPreguntaContestada.puntuacion = puntuacion
    this.nuevaPreguntaContestada.tiempo = this.tiempoRestante
    this.preguntasContestadas.push({ ...this.nuevaPreguntaContestada })
  
    this.nuevaPreguntaContestada = { idPregunta: -1, respuesta: '', tiempo: 0, puntuacion: 0 }
    this.tiempoRestante=0

    this.socketService.onceEscucharRespuestas().subscribe(() => {
      this.enResultado()
    })
    this.socketService.enviarRespuesta(this.codigoSesion)
  }


  enResultado(){
    this.paso="Resultado"
    this.socketService.onceEscucharSiguientePregunta().subscribe(() => {
      this.cuentaAtras()
    })
  }

  finalCuestionario(){

    let puntuacionFinal = 0
    for(let i = 0; i < this.preguntasContestadas.length; i++){
      puntuacionFinal = puntuacionFinal + this.preguntasContestadas[i].puntuacion
    }

    this.resultadoIndividual= {
      idCuestionario: this.cuestionario.idCuestionario,
      nombreUsuario: this.nombreUsuario,
      fecha: this.resultadoGrupal.fecha,
      hora: this.resultadoGrupal.hora,
      puntuacionFinal: puntuacionFinal
    }

    this.resultadoService.guardarResultadoCuestionarioIndividual(this.resultadoIndividual,this.preguntasContestadas).subscribe({
      next: (res) => {
        this.idResultadoIndividual = res.idResultado
        this.resultadoService.guardarGrupalIndividual(this.resultadoGrupal.idGrupal, this.idResultadoIndividual).subscribe({
          next: (res) => {
            this.socketService.enviarRespuesta(this.codigoSesion)
            this.socketService.onceEscucharRanking().subscribe({
              next: (data) => {
                this.ranking = data.ranking
                this.paso="ResultadoFinal"
              },
              error: (e) => {
                this.toastr.error('Error', e.message, {timeOut: 8000, closeButton: true});
              }
            })
          },
          error: (e) => {
            this.toastr.error('Error', e.message, {timeOut: 8000, closeButton: true});
          }
        })
      },
      error: (e) => {
        this.toastr.error('Error', e.message, {timeOut: 8000, closeButton: true});
      }}
    )
  }

  salirCuestionario(){
    this.socketService.salirSesion(this.codigoSesion)
    this.router.navigate(['/']);
  }
}

