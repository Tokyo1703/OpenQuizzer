import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CuestionarioService } from '../../services/cuestionario/cuestionario.service';
import { Usuario } from '../../interfaces/usuario';
import { Cuestionario } from '../../interfaces/cuestionario';
import { PreguntaContestada, PreguntaRecibidadBackend} from '../../interfaces/pregunta';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { ResultadoIndividual } from '../../interfaces/resultado';
import { ResultadoService } from '../../services/resultado/resultado.service';

@Component({
  selector: 'app-realizar-cuestionario-individual',
  imports: [FormsModule],
  templateUrl: './realizar-cuestionario-individual.component.html',
  styleUrl: './realizar-cuestionario-individual.component.css'
})
export class RealizarCuestionarioIndividualComponent {
  
  paso: string = "Inicio";
  
  registrado: boolean = false;
  perfil: Usuario ={
    nombre: '',
    apellidos: '',
    correo: '',
    nombreUsuario: '',
    contrasena: '',
    rol: ''
  }

  cuestionario: Cuestionario = {
    nombreUsuario: '',
    idCuestionario: -1,
    nombre: '',
    descripcion: '',
    privacidad: ''
  }

  nuevaPreguntaContestada: PreguntaContestada = {
    idPregunta: -1,
    respuesta: '',
    tiempo: 0,
    puntuacion: 0
  }

  preguntas: PreguntaRecibidadBackend[] = []
  preguntasContestadas: PreguntaContestada[] = []
  numeroPregunta: number = 0

  resultadoIndividual: ResultadoIndividual = {
    idCuestionario: -1,
    nombreUsuario: '',
    fecha: '',
    hora: '',
    puntuacionFinal: 0
  }

  // Controles de tiempo de cada pregunta
  tiempoRestante: number = 0
  intervaloControlador: any = null
  timeOutControlador: any = null

  


  constructor(private route: ActivatedRoute, private router: Router, private cuestionarioService: CuestionarioService,
    private toastr: ToastrService, private resultadoService: ResultadoService) { 
    const perfilGuardado = localStorage.getItem('perfil');

    if (perfilGuardado) {
      this.perfil = JSON.parse(perfilGuardado);
      this.registrado = true;
    }

    this.obtenerCuestionario()

    this.mostrarInicio();
  }

  obtenerCuestionario()
  {
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
    );
  }

  

  mostrarInicio() {
    
    setTimeout(() => {
      this.paso = "Pregunta";
      this.siguientePregunta();
    }, 4*1000); 
  }



  siguientePregunta(){
    this.tiempoRestante = this.preguntas[this.numeroPregunta].tiempo;
    
    this.intervaloControlador = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        this.finPregunta();    
      }
    }, 1000);
  }

  guardarRespuesta(contenido: string) {
    this.nuevaPreguntaContestada.respuesta = contenido
    this.finPregunta()
  }

  finPregunta(){
    clearInterval(this.intervaloControlador)
    
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
    this.paso = "Resultado"
    this.siguienteResultado();
  }

  siguienteResultado(){
    this.tiempoRestante = 30; 
    this.intervaloControlador = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        this.finResultado();     // se acabó el tiempo
      }
    }, 1000);
    
  }

  finResultado(){
    clearInterval(this.intervaloControlador)

    this.numeroPregunta = this.numeroPregunta + 1
    if(this.numeroPregunta >= this.preguntas.length){
      this.paso = "Finalizado"
      this.guardarResultadoCompleto()
      return
    }

    this.paso = "Pregunta"
    this.siguientePregunta();
  }

  guardarResultadoCompleto(){

    let puntuacionFinal = 0
    for(let i = 0; i < this.preguntasContestadas.length; i++){
      puntuacionFinal = puntuacionFinal + this.preguntasContestadas[i].puntuacion
    }

    this.resultadoIndividual= {
      idCuestionario: this.cuestionario.idCuestionario,
      nombreUsuario: this.perfil.nombreUsuario,
      fecha: new Date().toISOString().slice(0, 10),
      hora: new Date().toTimeString().slice(0, 8),
      puntuacionFinal:  puntuacionFinal
    }
  }

  RegresarHome(guardar: boolean){
    if(guardar){
      this.resultadoService.guardarResultadoCuestionarioIndividual(this.resultadoIndividual,this.preguntasContestadas).subscribe({
        next: (res) => {
          this.toastr.success('Resultado guardado', '' , {timeOut: 8000, closeButton: true});
        },
        error: (e) => {
          this.toastr.error('Error', e.message, {timeOut: 8000, closeButton: true});
        }}
      );
    }
    this.router.navigate(['/']);
  }
}
