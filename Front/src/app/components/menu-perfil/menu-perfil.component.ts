import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../interfaces/usuario';
import { UsuarioService } from '../../services/usuario/usuario.service';
declare module 'bootstrap'
import { Offcanvas } from 'bootstrap';


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
     this.usuarioService.getPerfil().subscribe({
      next: (res) => {
        this.perfil = res.perfil
      },
      error: (e) => {
        this.toastr.error(e.message, 'Error', {timeOut: 8000, closeButton: true})
      }
    })
  }


  @ViewChild('DesplegableMenuPerfil') offcanvasElement!: ElementRef;
  
  cerrarSesion(){
    this.usuarioService.cerrarSesion().subscribe({
      next: (res) => {
        this.toastr.success('Has cerrado sesión con éxito', undefined, {timeOut: 8000, closeButton: true});
        document.body.classList.remove('offcanvas-backdrop', 'offcanvas-open', 'modal-open');
        document.body.style.overflow = 'auto';
        this.router.navigate(['/']);  
      },
      error: (e) => {
        this.toastr.error('Error', e.message, {timeOut: 8000, closeButton: true});
      }
    });
  }
}
