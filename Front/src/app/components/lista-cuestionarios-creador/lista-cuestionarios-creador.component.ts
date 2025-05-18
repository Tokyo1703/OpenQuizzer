import { Component, OnInit} from '@angular/core';
import { CuestionarioService } from '../../services/cuestionario/cuestionario.service';
import { Cuestionario } from '../../interfaces/cuestionario';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-lista-cuestionarios-creador',
  imports: [RouterModule],
  templateUrl: './lista-cuestionarios-creador.component.html',
  styleUrl: './lista-cuestionarios-creador.component.css'
})
export class ListaCuestionariosCreadorComponent implements OnInit {

  listaCuestionarios: Cuestionario[] = []

  constructor(private cuestionarioService: CuestionarioService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.getListaCuestionarios()
  }
  
  getListaCuestionarios(){
    this.cuestionarioService.getMisCuestionarios().subscribe({
      next: (res) => {
        this.listaCuestionarios = res.cuestionarios
      },
      error: (e) => {
        this.toastr.error(e.message, 'Error', {timeOut: 8000, closeButton: true})
      }
    })
  }

  IniciarCuestionario(idCuestionario:number){
    this.router.navigate(['/sesionCuestionarioCreador', idCuestionario])
    
  }
}
