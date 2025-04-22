import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../interfaces/usuario';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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

  constructor(private usuarioService: UsuarioService, private router: RouterModule){}

  Registrar() {
    this.usuarioService.registrarUsuario(this.usuario).subscribe({
      next: (res) => {
        console.log('Usuario registrado:', res);
      },
      error: (e: HttpErrorResponse) => {
        console.error('Error al registrar el usuario:', e.message);
      }}
    );
  }
  
}
