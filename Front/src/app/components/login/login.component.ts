import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  nombreUsuario: string = '';
  contrasena: string = '';
  rol: string = '';
  constructor(private usuarioService: UsuarioService, private toastr: ToastrService, private router: Router){}

  Login() {
    if(this.nombreUsuario == "" || this.contrasena == "") {
      this.toastr.error('Error', 'Por favor completa todos los campos', {timeOut: 8000, closeButton: true});
      return;
    }

    this.usuarioService.login(this.nombreUsuario,this.contrasena).subscribe({
      next: (res) => {
        
        this.toastr.success('Login exitoso', 'Bienvenido/a ' + res.usuario.nombre, {timeOut: 8000, closeButton: true})
        localStorage.setItem('perfil', JSON.stringify(res.usuario));
        //Redirección en base al rol
        this.rol = res.usuario.rol
        if(this.rol=="Creador"){
          this.router.navigate(['/homeCreador'])
        }
        else{
          this.router.navigate(['/homeParticipante'])
        }
      },
      error: (e) => {
        this.toastr.error('Error', e.message, {timeOut: 8000, closeButton: true})
      }}
    );
  }
}
