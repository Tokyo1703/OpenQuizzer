import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Pregunta, Respuesta } from '../../interfaces/pregunta';
import { CuestionarioService } from '../../services/cuestionario/cuestionario.service';
import { RouterModule } from '@angular/router';
import { Usuario } from '../../interfaces/usuario';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-creacion-cuestionario',
  imports: [RouterModule, FormsModule],
  templateUrl: './creacion-cuestionario.component.html',
  styleUrl: './creacion-cuestionario.component.css'
})
export class CreacionCuestionarioComponent {

  perfil: Usuario ={
    nombre: '',
    apellidos: '',
    correo: '',
    nombreUsuario: '',
    contrasena: '',
    rol: ''
  }

  nombreCuestionario: string = '';
  descripcionCuestionario: string = '';
  privacidad: string = 'Publico';
  paso: number = 1;
  coloresRespuestas: string[] = [this.colorAleatorio(), this.colorAleatorio()];

  

  preguntas: Pregunta [] = []
  respuestaCorrecta: number = -1
  respuestasCorrectas: boolean[] = [false, false]
  nuevaPregunta: Pregunta = {
    tipo: "VerdaderoFalso",
    contenido: "",
    tiempo: 20,
    puntuacion: 100,
    puntosSegundo: 1,
    respuestas: [
      {idRespuesta: 0, contenido: "", correcta: "Falsa" }, 
      {idRespuesta: 0, contenido: "", correcta: "Falsa" }
    ]
  }
  

  constructor(private toastr: ToastrService, private router: Router, private cuestionarioService: CuestionarioService,
    private usuarioService: UsuarioService){
    
    this.usuarioService.getPerfil().subscribe({
      next: (res) => {
        this.perfil = res.perfil
      },
      error: (e) => {
        this.toastr.error(e.message, 'Error', {timeOut: 8000, closeButton: true})
      }
    })
  }

  Siguiente() {
    if(this.nombreCuestionario == "") {
      this.toastr.error('Error', 'Por favor el campo de Nombre es obligatorio', {timeOut: 8000, closeButton: true});
      return;
    }
    if(this.privacidad== "") {
      this.toastr.error('Error', 'Por favor seleccione la privacidad del cuestionario', {timeOut: 8000, closeButton: true});
      return;
    }
    this.paso=this.paso+1
  }

  GuardarPregunta() {
    
    if(this.nuevaPregunta.contenido == "" ) {
      this.toastr.error('Error', 'Por favor no puede dejar el campo de pregunta vacío', {timeOut: 8000, closeButton: true});
      return;
    }

    for(let i=0; i<this.nuevaPregunta.respuestas.length; i++){
      if(this.nuevaPregunta.respuestas[i].contenido == "") {
        this.toastr.error('Error', 'Por favor no puede dejar ningún campo de respuesta vacío', {timeOut: 8000, closeButton: true});
        return;
      }
    }

    //Validaciones Opcion Unica y Verdadero Falso
    if(this.nuevaPregunta.tipo == "VerdaderoFalso" || this.nuevaPregunta.tipo == "OpcionUnica") {
      if(this.nuevaPregunta.respuestas.length < 2) {
        this.toastr.error('Error', 'Por favor debe haber al menos 2 respuestas', {timeOut: 8000, closeButton: true});
        return;
      }
      if(this.respuestaCorrecta == -1) {
        this.toastr.error('Error', 'Por favor seleccione la respuesta correcta', {timeOut: 8000, closeButton: true});
        return;
      }
      this.nuevaPregunta.respuestas[this.respuestaCorrecta].correcta = "Correcta"
    }

    //Validaciones Opcion Multiple
    if(this.nuevaPregunta.tipo == "OpcionMultiple") {
      let existeCorrecta = false

      if(this.nuevaPregunta.respuestas.length < 2) {
        this.toastr.error('Error', 'Por favor debe haber al menos 2 respuestas', {timeOut: 8000, closeButton: true});
        return;
      }

      for(let i=0; i<this.respuestasCorrectas.length; i++){
        if(this.respuestasCorrectas[i]) {
          this.nuevaPregunta.respuestas[i].correcta = "Correcta"
          existeCorrecta = true
        }
      }
      if(!existeCorrecta) {
        this.toastr.error('Error', 'Por favor seleccione al menos una respuesta correcta', {timeOut: 8000, closeButton: true});
        return;
      }

      
    }
    
    //Validaciones Respuesta Abierta
    if(this.nuevaPregunta.tipo == "RespuestaAbierta") {
      if(this.nuevaPregunta.respuestas.length < 1) {
        this.toastr.error('Error', 'Por favor debe haber al menos 1 respuestas', {timeOut: 8000, closeButton: true});
        return;
      }
      for(let i=0; i<this.nuevaPregunta.respuestas.length; i++){
        this.nuevaPregunta.respuestas[i].correcta = "Correcta"
      }
    }
    
    this.preguntas.push({ ...this.nuevaPregunta })
    

    //Restablecemos los valores de la nueva pregunta
    this.nuevaPregunta.contenido = ""
    this.respuestaCorrecta = -1
    this.respuestasCorrectas = [false,false]
    this.nuevaPregunta.respuestas= [
      {idRespuesta: 0, contenido: "", correcta: "Falsa" }, 
      {idRespuesta: 0, contenido: "", correcta: "Falsa" }
    ]
    this.coloresRespuestas = [this.colorAleatorio(), this.colorAleatorio()]

    this.toastr.success('Pregunta añadida', 'Ya puedes añadir otra pregunta' , {timeOut: 8000, closeButton: true});
  }

  Volver() {
    this.paso=this.paso-1
  }

  Guardar(){
    if(this.nombreCuestionario == "") {
      this.toastr.error('Error', 'Por favor el campo de Nombre es obligatorio', {timeOut: 8000, closeButton: true});
      return;
    }
    if(this.privacidad== "") {
      this.toastr.error('Error', 'Por favor seleccione la privacidad del cuestionario', {timeOut: 8000, closeButton: true});
      return;
    }
    if(this.preguntas.length < 1) {
      this.toastr.error('Error', 'Debe haber al menos una pregunta creada, haga click en "Siguiente"', {timeOut: 8000, closeButton: true});
      return;
    }

    const cuestionario = {
      nombreUsuario: this.perfil.nombreUsuario,
      nombre: this.nombreCuestionario,
      descripcion: this.descripcionCuestionario,
      privacidad: this.privacidad,
    };

    this.cuestionarioService.crearCuestionario(cuestionario, JSON.parse(JSON.stringify(this.preguntas))).subscribe({
      next: (res) => {
        this.toastr.success('Ya puedes usarlo', 'Cuestionario creado' , {timeOut: 8000, closeButton: true});
        this.router.navigate(['/homeCreador']);
      },
      error: (e) => {
        this.toastr.error('Error', e.message, {timeOut: 8000, closeButton: true});
      }}
    );
  }

  AgregarRespuesta() {
    this.nuevaPregunta.respuestas.push({idRespuesta: 0, contenido: "", correcta: "Falsa" })
    this.coloresRespuestas.push(this.colorAleatorio())
    this.respuestasCorrectas.push(false)
  }

  EliminarRespuesta() {
    this.nuevaPregunta.respuestas.pop()
    this.coloresRespuestas.pop()
    this.respuestasCorrectas.pop()
  }

  colorAleatorio() {
    const hue = Math.floor(Math.random() * 360); // tono aleatorio
    const saturation = 70 + Math.random() * 20;  // saturación entre 70-90%
    const lightness = 55 + Math.random() * 10;   // luminosidad entre 55-65%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
}
