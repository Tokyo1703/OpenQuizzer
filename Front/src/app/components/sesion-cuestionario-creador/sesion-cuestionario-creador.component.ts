import { Component, OnInit} from '@angular/core';
import { SocketService } from '../../services/socket/socket.service';
import { CuestionarioService } from '../../services/cuestionario/cuestionario.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cuestionario } from '../../interfaces/cuestionario';
import { PreguntaRecibidaBackend } from '../../interfaces/pregunta';
import { ResultadoGrupal, ResultadoIndividual } from '../../interfaces/resultado';
import { ResultadoService } from '../../services/resultado/resultado.service';

@Component({
  selector: 'app-sesion-cuestionario-creador',
  imports: [],
  templateUrl: './sesion-cuestionario-creador.component.html',
  styleUrl: './sesion-cuestionario-creador.component.css'
})
export class SesionCuestionarioCreadorComponent implements OnInit {
  codigo: number = 0
  numeroParticipantes:number=0;
  numeroPregunta:number=-1;
  paso: string ="SalaEspera"
  tiempoRestante: number = 0
  intervaloControlador: any = null

  participantes: string[] = [];

  cuestionario: Cuestionario = {
    nombreUsuario: '',
    idCuestionario: -1,
    nombre: '',
    descripcion: '',
    privacidad: ''
  }
  preguntas: PreguntaRecibidaBackend[] = []
  resultadoGrupal: ResultadoGrupal = {
    idGrupal: -1,
    idCuestionario: -1,
    fecha: '',
    hora: ''
  }
  ranking: ResultadoIndividual[] = [];
  

  constructor(private socketService: SocketService, private route: ActivatedRoute, private router: Router,
      private cuestionarioService: CuestionarioService, private toastr: ToastrService, private resultadoService: ResultadoService) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.cuestionario.idCuestionario = Number(params.get('id'));
    });

    this.obtenerCuestionario();

    this.socketService.onActualizarParticipantes().subscribe(data => {
      this.numeroParticipantes = data.numeroParticipantes;
      this.participantes = data.participantes;
    })

    
  }

  obtenerCuestionario(){

    this.cuestionarioService.getMiCuestionarioCompleto(this.cuestionario.idCuestionario).subscribe({
      next: (res) => {
        this.cuestionario=res.cuestionario
        this.preguntas=res.preguntas
        this.socketService.crearSesion(this.cuestionario,this.preguntas).subscribe({
          next: (data) => {
            this.codigo = Number(data.codigoSesion);
            this.toastr.success('Sesión creada correctamente', 'Correcto', {timeOut: 8000, closeButton: true})
          },
          error: (e) => {
            this.toastr.error(e.message, 'Error', {timeOut: 8000, closeButton: true})
          }
        })
      },
      error: (e) => {
        this.toastr.error(e.message, 'Error', {timeOut: 8000, closeButton: true})
      }}
    )
  }

  
  iniciarCuestionario(){
    this.socketService.iniciarCuestionario(this.codigo)
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
    this.tiempoRestante=3
    this.paso="CuentaAtras"
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
        this.enResultado()
      }
    }, 1000)

    this.socketService.onceEscucharRespuestas().subscribe(() => {
      this.enResultado()
    })
  }

  enResultado(){
    clearInterval(this.intervaloControlador)
    this.paso="Resultado"
  }

  siguientePregunta(){
    this.socketService.siguientePregunta(this.codigo)
    this.cuentaAtras()
  }

  finalCuestionario(){
    this.resultadoGrupal = {
      idGrupal: -1,
      idCuestionario: this.cuestionario.idCuestionario,
      fecha: new Date().toISOString().slice(0, 10),
      hora: new Date().toTimeString().slice(0, 8)
    }
    this.resultadoService.guardarResultadoGrupal(this.resultadoGrupal).subscribe({
      next: (res) => {
        this.resultadoGrupal.idGrupal = res.idResultado
        this.toastr.success('Resultados guardados correctamente', 'Correcto', {timeOut: 8000, closeButton: true})
        this.socketService.finalizarCuestionario(this.codigo, this.resultadoGrupal)
      }
      , error: (e) => {
        this.toastr.error(e.message, 'Error', {timeOut: 8000, closeButton: true})
      }
    })
    this.socketService.onceEscucharRespuestas().subscribe(() => {
      this.resultadoService.getRanking(this.resultadoGrupal.idGrupal).subscribe({
      next: (res) => {
        this.ranking = res.ranking;
        this.socketService.enviarRanking(this.codigo, this.ranking)
        this.paso="FinalCuestionario"
      },
      error: (e) => {
        this.toastr.error(e.message, 'Error', { timeOut: 8000, closeButton: true })
      }
    })
      
    })
    
  }

  cerrarSesion(){
    this.socketService.cerrarSesion(this.codigo)
    this.router.navigate(['/'])
  }


  ngOnDestroy(){ 
    this.socketService.cerrarSesion(this.codigo);
  }
}
