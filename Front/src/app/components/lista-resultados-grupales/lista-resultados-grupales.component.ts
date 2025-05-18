import { Component } from '@angular/core';
import { ResultadoGrupalRecibido } from '../../interfaces/resultado';
import { Cuestionario } from '../../interfaces/cuestionario';
import { ResultadoService } from '../../services/resultado/resultado.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-resultados-grupales',
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './lista-resultados-grupales.component.html',
  styleUrl: './lista-resultados-grupales.component.css'
})
export class ListaResultadosGrupalesComponent {
  listaResultados: (ResultadoGrupalRecibido & { cuestionario: Cuestionario })[] = [];
  listaCuestionarios: Cuestionario[] = []
  coloresResultados: string[] = []
  rol: string = ''

  constructor(private resultadoService: ResultadoService, private toastr: ToastrService, private router: Router,
  private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.getResultadosGrupales()
    this.usuarioService.getPerfil().subscribe({
      next: (res) => {
        this.rol = res.perfil.rol
      },
      error: (e) => {
        this.toastr.error(e.message, 'Error', { timeOut: 8000, closeButton: true })
      }
    })

  }

  getResultadosGrupales(){
    this.resultadoService.getResultadosGrupales().subscribe({
      next: (res) => {
        const mapCuestionario = new Map<number, Cuestionario>();
        res.cuestionarios.forEach((cuestionario: Cuestionario) => mapCuestionario.set(cuestionario.idCuestionario, cuestionario));

        this.listaResultados = res.resultados.map((resultado: ResultadoGrupalRecibido) => ({
          ...resultado,
          cuestionario: mapCuestionario.get(resultado.idCuestionario)!
        }));

        for (let i = 0; i < this.listaResultados.length; i++) {
          this.listaResultados[i].fecha = this.formatFecha(this.listaResultados[i].fecha)
        }
        this.setColores()
      },
      error: (e) => {
        this.toastr.error(e.message, 'Error', {timeOut: 8000, closeButton: true})
      }
    })
  }
  

  setColores() {
    for (let i = 0; i < this.listaResultados.length; i++) {
      this.coloresResultados.push(this.colorAleatorio())
    }
  }

  colorAleatorio() {
    const hue = Math.floor(Math.random() * 360); 
    const saturation = 70 + Math.random() * 20;  
    const lightness = 55 + Math.random() * 10;  
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  formatFecha(fecha: string): string {
    const fechaObj = new Date(fecha);
    const day = String(fechaObj.getDate()).padStart(2, '0'); 
    const month = String(fechaObj.getMonth() + 1).padStart(2, '0'); 
    const year = fechaObj.getFullYear(); 
    return `${day}/${month}/${year}`; 
  }

}
