import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CuestionarioService } from '../../services/cuestionario/cuestionario.service';
import { Usuario } from '../../interfaces/usuario';
import { Cuestionario } from '../../interfaces/cuestionario';
import { Pregunta } from '../../interfaces/pregunta';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-realizar-cuestionario-individual',
  imports: [],
  templateUrl: './realizar-cuestionario-individual.component.html',
  styleUrl: './realizar-cuestionario-individual.component.css'
})
export class RealizarCuestionarioIndividualComponent {
  
  paso: number = 0;
  
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

  preguntas: Pregunta[] = [];

  


  constructor(private route: ActivatedRoute, private router: Router, private cuestionarioService: CuestionarioService, private toastr: ToastrService) { 
    const perfilGuardado = localStorage.getItem('perfil');

    if (perfilGuardado) {
      this.perfil = JSON.parse(perfilGuardado);
      this.registrado = true;
    }

    this.obtenerCuestionario()

    this.mostrarPaso0();
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

  mostrarPaso0() {
    this.paso = 0;
    setTimeout(() => {
      this.paso = 1;
      this.siguientePregunta();
    }, 4*1000); 
  }

  siguientePregunta(){
    setTimeout(() => {
      this.paso = this.paso + 1;
      this.siguientePregunta();
    }, this.preguntas[this.paso-1].tiempo*1000); 
  }
}
