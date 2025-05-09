import { Component, OnInit, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultadoIndividual } from '../../interfaces/resultado';
import { Cuestionario } from '../../interfaces/cuestionario';
import { ResultadoService } from '../../services/resultado/resultado.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PreguntaContestada, PreguntaContestadaCompleta, PreguntaRecibidadBackend } from '../../interfaces/pregunta';

@Component({
  selector: 'app-resultado-individual-completo',
  imports: [RouterModule],
  templateUrl: './resultado-individual-completo.component.html',
  styleUrl: './resultado-individual-completo.component.css'
})
export class ResultadoIndividualCompletoComponent implements OnInit {

  idResultado:number = 0
  preguntasContestadas: PreguntaContestadaCompleta[] = []
  resultadoIndividual: ResultadoIndividual = {
    idCuestionario: -1,
    nombreUsuario: '',
    fecha: '',
    hora: '',
    puntuacionFinal: 0
  }
  cuestionario: Cuestionario ={
    nombreUsuario: '',
    idCuestionario: -1,
    nombre: '',
    descripcion: '',
    privacidad: ''
  }
  
  
  
  constructor(private resultadoService: ResultadoService, private toastr: ToastrService, private router: Router, private route: ActivatedRoute) { } 

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.idResultado = Number(params.get('id'));
    });
    this.getResultadoIndividualCompleto(this.idResultado)
  }
  

  getResultadoIndividualCompleto(id: number) {
    this.resultadoService.getResultadoIndividual(this.idResultado).subscribe({
      next: (res) => {
        this.cuestionario = res.cuestionario
        this.resultadoIndividual = res.resultado
        this.preguntasContestadas = res.preguntasContestadas
        this.resultadoIndividual.fecha = this.formatFecha(this.resultadoIndividual.fecha)
      },
      error: (e) => {
        this.toastr.error(e.message, 'Error', { timeOut: 8000, closeButton: true })
      }
    })
  }

  formatFecha(fecha: string): string {
    const fechaObj = new Date(fecha);
    const day = String(fechaObj.getDate()).padStart(2, '0'); 
    const month = String(fechaObj.getMonth() + 1).padStart(2, '0'); 
    const year = fechaObj.getFullYear(); 
    return `${day}/${month}/${year}`; 
  }

}
