import { Component, OnInit} from '@angular/core';
import { SocketService } from '../../services/socket/socket.service';
import { CuestionarioService } from '../../services/cuestionario/cuestionario.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cuestionario } from '../../interfaces/cuestionario';
import { PreguntaRecibidadBackend } from '../../interfaces/pregunta';
import { UsuarioService } from '../../services/usuario/usuario.service';
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
  preguntas: PreguntaRecibidadBackend[] = []
  numeroParticipantes: number = 0;
  numeroPregunta:number=-1;
  participantes: string[] = [];
  codigoSesion: number = 0
  nombreUsuario: string = ''

  tiempoRestante: number = 0
  intervaloControlador: any = null


  constructor(private socketService: SocketService, private route: ActivatedRoute, private router: Router, private usuarioService: UsuarioService,
              private cuestionarioService: CuestionarioService, private toastr: ToastrService){}

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
    
    
    this.socketService.onCerrarSesion().subscribe(() => {
      this.toastr.error('La sesión ha sido cerrada por el creador', 'Error', {timeOut: 8000, closeButton: true})
      this.router.navigate(['/']);
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






}
