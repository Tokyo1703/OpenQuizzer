import { Component } from '@angular/core';
import { Cuestionario } from '../../interfaces/cuestionario';
import { CuestionarioService } from '../../services/cuestionario/cuestionario.service';
import { ToastrService } from 'ngx-toastr';
import { RouterModule, Router } from '@angular/router';


@Component({
  selector: 'app-lista-cuestionarios',
  imports: [RouterModule],
  templateUrl: './lista-cuestionarios.component.html',
  styleUrl: './lista-cuestionarios.component.css'
})

export class ListaCuestionariosComponent {

  listaCuestionarios: Cuestionario[] = []
  coloresCuestionarios: string[] = []

  constructor(private cuestionarioService: CuestionarioService, private toastr: ToastrService, private router: Router) { 
    this.getListaCuestionarios()
  }

  getListaCuestionarios(){
    this.cuestionarioService.getCuestionariosPublicos().subscribe({
      next: (res) => {
        this.listaCuestionarios = res.cuestionarios
        this.setColoresCuestionarios()
      },
      error: (e) => {
        this.toastr.error(e.message, 'Error', {timeOut: 8000, closeButton: true})
      }
    })
  }

  setColoresCuestionarios() {
    for (let i = 0; i < this.listaCuestionarios.length; i++) {
      this.coloresCuestionarios.push(this.colorAleatorio())
    }
  }

  colorAleatorio() {
    const hue = Math.floor(Math.random() * 360); // tono aleatorio
    const saturation = 70 + Math.random() * 20;  // saturación entre 70-90%
    const lightness = 55 + Math.random() * 10;   // luminosidad entre 55-65%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  RealizarCuestionario(idCuestionario: number) {
    this.router.navigate(['/realizarCuestionarioIndividual', idCuestionario])
  }

}


