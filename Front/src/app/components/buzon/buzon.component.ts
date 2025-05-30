import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SugerenciaService } from '../../services/sugerencia/sugerencia.service';

@Component({
  selector: 'app-buzon',
  imports: [FormsModule, RouterModule],
  templateUrl: './buzon.component.html',
  styleUrl: './buzon.component.css'
})
export class BuzonComponent {
  
  nombreCompleto:string = '';
  correo:string = '';
  contenido:string = '';
  constructor(private toastr: ToastrService, private router: Router, private sugerenciaService: SugerenciaService){}

  Enviar(){
    if (this.nombreCompleto && this.correo && this.contenido) {
      const sugerencia = {
        nombreCompleto: this.nombreCompleto,
        correo: this.correo,
        contenido: this.contenido
      };
      this.sugerenciaService.crear(sugerencia).subscribe({
        next: (res) => {
          this.toastr.success('', 'Sugerencia enviada', {timeOut: 8000, closeButton: true})
          this.nombreCompleto = '';
          this.correo = '';
          this.contenido = '';
          this.router.navigate(['']);
        },
        error: (e) => {
          this.toastr.error('Error', e.message, {timeOut: 8000, closeButton: true})
        }}
      );
      

    } else {
      console.error('Por favor, completa todos los campos.');
    }
  }

}
