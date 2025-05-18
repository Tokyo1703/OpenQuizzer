import { Component } from '@angular/core';
import { ActivatedRoute, Route, RouterModule } from '@angular/router';
import { ResultadoService } from '../../services/resultado/resultado.service';
import { ResultadoIndividual } from '../../interfaces/resultado';
import { ToastrService } from 'ngx-toastr';
import { ResultadoGrupal } from '../../interfaces/resultado';
import { Cuestionario } from '../../interfaces/cuestionario';

@Component({
  selector: 'app-resultado-grupal-completo',
  imports: [RouterModule],
  templateUrl: './resultado-grupal-completo.component.html',
  styleUrl: './resultado-grupal-completo.component.css'
})
export class ResultadoGrupalCompletoComponent {

  ranking: ResultadoIndividual[] = [];
  idResultadoGrupal: number = 0;
  cuestionario: Cuestionario = {
    idCuestionario: 0,
    nombreUsuario: '',
    nombre: '',
    descripcion: '',
    privacidad: ''
  };

  resultadoGrupal: ResultadoGrupal= {
    idGrupal:0,
    idCuestionario: 0,
    fecha: "",
    hora:""
  }

  constructor(private resultadoService: ResultadoService, private route: ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.idResultadoGrupal = Number(params.get('id'));
    });
    this.resultadoService.getResultadoGrupal(this.idResultadoGrupal).subscribe({
      next: (res) => {
        this.cuestionario = res.cuestionario
        this.resultadoGrupal = res.resultado
        this.resultadoGrupal.fecha = this.formatFecha(this.resultadoGrupal.fecha)
      },
      error: (e) => {
        this.toastr.error(e.message, 'Error', { timeOut: 8000, closeButton: true })
      }
    })


    this.resultadoService.getRanking(this.idResultadoGrupal).subscribe({
      next: (res) => {
        this.ranking = res.ranking;
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
