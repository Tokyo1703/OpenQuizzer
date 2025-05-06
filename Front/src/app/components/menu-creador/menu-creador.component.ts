import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../interfaces/usuario';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-menu-creador',
  imports: [RouterModule],
  templateUrl: './menu-creador.component.html',
  styleUrl: './menu-creador.component.css'
})
export class MenuCreadorComponent {
  
  perfil: Usuario ={
    nombre: '',
    apellidos: '',
    correo: '',
    nombreUsuario: '',
    contrasena: '',
    rol: ''
  }

  constructor(private usuarioService: UsuarioService, private router: Router, private toastr: ToastrService ){
    const perfilGuardado = localStorage.getItem('perfil');

    if (perfilGuardado) {
      this.perfil = JSON.parse(perfilGuardado);
    }
  }



  cerrarSesion(){
    this.usuarioService.cerrarSesion().subscribe({
      next: (res) => {
        this.toastr.success('Has cerrado sesión con éxito', undefined, {timeOut: 8000, closeButton: true});
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.toastr.error('Error', e.message, {timeOut: 8000, closeButton: true});
      }
    });
  }
}
