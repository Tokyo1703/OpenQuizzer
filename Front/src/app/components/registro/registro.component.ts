import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../interfaces/usuario';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [RouterModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})

export class RegistroComponent {

  usuario: Usuario = {
    nombreUsuario: "",
    nombre: "",
    apellidos: "",
    correo: "",
    contrasena: "",
    rol: ""
  };

  constructor(private usuarioService: UsuarioService, private toastr: ToastrService, private router: Router){}

  Registrar() {
    if(this.usuario.nombreUsuario == "" || this.usuario.nombre == "" || this.usuario.apellidos == "" || this.usuario.correo == "" || this.usuario.contrasena == "" || this.usuario.rol == "") {
      this.toastr.error('Error', 'Por favor completa todos los campos', {timeOut: 8000, closeButton: true});
      return;
    }
    
    this.usuarioService.registrarUsuario(this.usuario).subscribe({
      next: (res) => {
        this.toastr.success('Registro exitoso', 'Ya puedes iniciar sesión' , {timeOut: 8000, closeButton: true});
        this.router.navigate(['/login']);
      },
      error: (e) => {
        this.toastr.error('Error', e.message, {timeOut: 8000, closeButton: true});
      }}
    );
  }
  
}
