import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../interfaces/usuario';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-perfil',
  imports: [RouterModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit{
  constructor(private usuarioService: UsuarioService, private toastr: ToastrService, private router: Router) { }
  usuario: Usuario = {
    nombreUsuario: '',
    nombre: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    rol: '',
  }
  ngOnInit(): void {
    this.usuarioService.getPerfil().subscribe({
      next: (res) => {
        this.usuario = res.perfil
      },
      error: (e) => {
        this.toastr.error(e.message, 'Error', {timeOut: 8000, closeButton: true})
      }
    })
  }

  Guardar(){
    if (this.usuario.contrasena === undefined) {
      this.usuario.contrasena = '';  
    }

    this.usuarioService.modificarPerfil({...this.usuario}).subscribe({
      next: (res) => {
        this.toastr.success('Se ha guardado la información del usuario', 'Información modificado', {timeOut: 8000, closeButton: true})
        this.router.navigate([''])
      },
      error: (e) => {
        this.toastr.error(e.message, 'Error', {timeOut: 8000, closeButton: true})
      }
    })
  }
}
