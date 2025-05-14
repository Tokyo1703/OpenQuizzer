import { Component, OnInit} from '@angular/core';
import { SocketService } from '../../services/socket/socket.service';
import { CuestionarioService } from '../../services/cuestionario/cuestionario.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cuestionario } from '../../interfaces/cuestionario';
import { PreguntaRecibidadBackend } from '../../interfaces/pregunta';

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
  preguntas: PreguntaRecibidadBackend[] = []

  constructor(private socketService: SocketService, private route: ActivatedRoute, private router: Router,
              private cuestionarioService: CuestionarioService, private toastr: ToastrService) { }

  ngOnInit(): void {


    this.obtenerCuestionario();

    this.socketService.crearSesion(this.cuestionario.idCuestionario).subscribe({
      next: (data) => {
        this.codigo = Number(data.codigoSesion);
        this.toastr.success('Sesión creada correctamente', 'Correcto', {timeOut: 8000, closeButton: true})
      },
      error: (e) => {
        this.toastr.error(e.message, 'Error', {timeOut: 8000, closeButton: true})
      }
    })

    
    
    this.socketService.onActualizarParticipantes().subscribe(data => {
      this.numeroParticipantes = data.numeroParticipantes;
      this.participantes = data.participantes;
    })

    
  }

  obtenerCuestionario(){
    this.route.paramMap.subscribe(params => {
      this.cuestionario.idCuestionario = Number(params.get('id'));
    });

    this.cuestionarioService.getCuestionarioCompleto(this.cuestionario.idCuestionario).subscribe({
      next: (res) => {
        this.cuestionario=res.cuestionario
        this.preguntas=res.preguntas
      },
      error: (e) => {
        this.toastr.error(e.message, 'Error', {timeOut: 8000, closeButton: true})
      }}
    )
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
    this.tiempoRestante=4
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

    /*this.socketService.onTodosRespondidos(this.codigo).subscribe(data => {
      this.finPregunta()
    })*/

    this.tiempoRestante = this.preguntas[this.numeroPregunta].tiempo;
    this.intervaloControlador = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        this.finPregunta()
      }
    }, 1000)

    
  }

  finPregunta(){
    clearInterval(this.intervaloControlador)
    
    this.paso="Resultado"
  }

  resultadoFinal(){
    
    this.paso="ResultadoFinal"
  }

  cerrarSesion(){
    this.socketService.cerrarSesion(this.codigo)
    this.router.navigate(['/'])
  }


  ngOnDestroy(){ 
    this.socketService.cerrarSesion(this.codigo);
  }
}
