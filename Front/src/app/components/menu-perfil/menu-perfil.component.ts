import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../interfaces/usuario';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-menu-perfil',
  imports: [RouterModule],
  templateUrl: './menu-perfil.component.html',
  styleUrl: './menu-perfil.component.css'
})
export class MenuPerfilComponent {
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
