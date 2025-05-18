import { Component, OnInit} from '@angular/core';
import { Cuestionario } from '../../interfaces/cuestionario';
import { PreguntaRecibidaBackend } from '../../interfaces/pregunta';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CuestionarioService } from '../../services/cuestionario/cuestionario.service';
import { ToastrService } from 'ngx-toastr';
import e from 'express';

@Component({
  selector: 'app-editar-cuestionario',
  imports: [FormsModule],
  templateUrl: './editar-cuestionario.component.html',
  styleUrl: './editar-cuestionario.component.css'
})
export class EditarCuestionarioComponent implements OnInit {
  cuestionario: Cuestionario = {
    idCuestionario: 0,
    nombreUsuario: '',
    nombre: '',
    descripcion: '',
    privacidad: 'Publico',
  }
  preguntas: PreguntaRecibidaBackend[] = []
  numeroPregunta:number= -1
  coloresRespuestas: string[] = []
  respuestasCorrectas: boolean[][]=[]
  respuestaCorrecta: number = -1
  constructor(private route: ActivatedRoute, private cuestionarioService: CuestionarioService, private toastr: ToastrService,
    private router: Router){}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.cuestionario.idCuestionario = Number(params.get('id'));
    });
    this.cuestionarioService.getMiCuestionarioCompleto(this.cuestionario.idCuestionario).subscribe({
      next: (res) => {
        this.cuestionario=res.cuestionario
        this.preguntas=res.preguntas
        for (let i = 0; i < this.preguntas.length; i++) {
          let respuestasCorrectasAux: boolean[] = []
          for (let j = 0; j < this.preguntas[i].respuestas.length; j++) {
            if(this.preguntas[i].respuestas[j].correcta=="Correcta"){
              respuestasCorrectasAux.push(true)
            }
            else{
              respuestasCorrectasAux.push(false)
            }
          }
          this.respuestasCorrectas.push(respuestasCorrectasAux)
        }
      },
      error: (e) => {
        this.toastr.error(e.message, 'Error', {timeOut: 8000, closeButton: true})
      }}
    )
  }

  siguientePregunta(){
    if(this.numeroPregunta !== -1){
      if(this.actualizarPreguntaActual()){
        this.numeroPregunta++
        this.actualizarSiguientePregunta()
      }
    }
    else{
      this.numeroPregunta++
      this.actualizarSiguientePregunta()
    }
  }

  atras(){
    if(this.actualizarPreguntaActual()){
      this.numeroPregunta--
      if(this.numeroPregunta !== -1){
        this.actualizarSiguientePregunta()
      }
    }
  }

  actualizarPreguntaActual():boolean { 
    if(this.preguntas[this.numeroPregunta].contenido == "" ) {
      this.toastr.error('Error', 'Por favor no puede dejar el campo de pregunta vacío', {timeOut: 8000, closeButton: true});
      return false;
    }

    for(let i=0; i<this.preguntas[this.numeroPregunta].respuestas.length; i++){
      if(this.preguntas[this.numeroPregunta].respuestas[i].contenido == "") {
        this.toastr.error('Error', 'Por favor no puede dejar ningún campo de respuesta vacío', {timeOut: 8000, closeButton: true});
        return false;
      }
    }

    //Validaciones Opcion Unica y Verdadero Falso
    if(this.preguntas[this.numeroPregunta].tipo == "OpcionUnica") {
      if(this.preguntas[this.numeroPregunta].respuestas.length < 2) {
        this.toastr.error('Error', 'Por favor debe haber al menos 2 respuestas', {timeOut: 8000, closeButton: true});
        return false;
      }
      this.preguntas[this.numeroPregunta].respuestas[this.respuestaCorrecta].correcta = "Correcta"
    }

    //Validaciones Opcion Multiple
    if(this.preguntas[this.numeroPregunta].tipo == "OpcionMultiple") {
      let existeCorrecta = false

      if(this.preguntas[this.numeroPregunta].respuestas.length < 2) {
        this.toastr.error('Error', 'Por favor debe haber al menos 2 respuestas', {timeOut: 8000, closeButton: true});
        return false;
      }

      for(let i=0; i<this.respuestasCorrectas[this.numeroPregunta].length; i++){
        if(this.respuestasCorrectas[this.numeroPregunta][i]) {
          this.preguntas[this.numeroPregunta].respuestas[i].correcta = "Correcta"
          existeCorrecta = true
        }
      }
      if(!existeCorrecta) {
        this.toastr.error('Error', 'Por favor seleccione al menos una respuesta correcta', {timeOut: 8000, closeButton: true});
        return false;
      }
    }
    
    //Validaciones Respuesta Abierta
    if(this.preguntas[this.numeroPregunta].tipo == "RespuestaAbierta") {
      if(this.preguntas[this.numeroPregunta].respuestas.length < 1) {
        this.toastr.error('Error', 'Por favor debe haber al menos 1 respuestas', {timeOut: 8000, closeButton: true});
        return false;
      }
      for(let i=0; i<this.preguntas[this.numeroPregunta].respuestas.length; i++){
        this.preguntas[this.numeroPregunta].respuestas[i].correcta = "Correcta"
      }
    }
    return true;
    
  }


  actualizarSiguientePregunta() {
    this.coloresRespuestas = []
    if(this.preguntas[this.numeroPregunta].tipo == "OpcionUnica") {
      for (let i = 0; i < this.preguntas[this.numeroPregunta].respuestas.length; i++) {
        if(this.preguntas[this.numeroPregunta].respuestas[i].correcta=="Correcta"){
          this.respuestaCorrecta = i
        }
      }
    }
    for (let i = 0; i < this.preguntas[this.numeroPregunta].respuestas.length; i++) {
      this.coloresRespuestas.push(this.colorAleatorio())
    }
  }

  AgregarRespuesta() {
    if(this.preguntas[this.numeroPregunta].tipo=="RespuestaAbierta"){
      this.preguntas[this.numeroPregunta].respuestas.push({idRespuesta: 0, contenido: "", correcta: "Correcta" })
      this.respuestasCorrectas[this.numeroPregunta].push(true)
    }
    else{
      this.preguntas[this.numeroPregunta].respuestas.push({idRespuesta: 0, contenido: "", correcta: "Falsa" })
      this.respuestasCorrectas[this.numeroPregunta].push(false)
    }
    this.coloresRespuestas.push(this.colorAleatorio())
  }

  EliminarRespuesta() {
    this.preguntas[this.numeroPregunta].respuestas.pop()
    this.respuestasCorrectas[this.numeroPregunta].pop()
    this.coloresRespuestas.pop()
  }

  colorAleatorio() {
    const hue = Math.floor(Math.random() * 360); // tono aleatorio
    const saturation = 70 + Math.random() * 20;  // saturación entre 70-90%
    const lightness = 55 + Math.random() * 10;   // luminosidad entre 55-65%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  Guardar(){
    this.cuestionarioService.modificarCuestionario(JSON.parse(JSON.stringify(this.cuestionario)), JSON.parse(JSON.stringify(this.preguntas))).subscribe({
      next: (res) => {
        this.toastr.success('CuestionarioGuardadoCorrectamente', 'Correcto' , {timeOut: 8000, closeButton: true});
        this.router.navigate(['/homeCreador']);
      },
      error: (e) => {
        this.toastr.error('Error', e.message, {timeOut: 8000, closeButton: true});
      }}
    );
  }

}
