/*
    OpenQuizzer  © 2025 by Carla Bravo Maestre is licensed under CC BY 4.0.
    To view a copy of this license, visit https://creativecommons.org/licenses/by/4.0/
*/
import { Component, OnInit} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { UsuarioService } from './services/usuario/usuario.service';
import { Router } from '@angular/router';
import { MenuPerfilComponent } from "./components/menu-perfil/menu-perfil.component";
import { FormsModule } from '@angular/forms';
import { ListaCuestionariosComponent } from "./components/lista-cuestionarios/lista-cuestionarios.component";
import { SocketService } from './services/socket/socket.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, MenuPerfilComponent, FormsModule, ListaCuestionariosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  codigoSesion: string="";

  constructor(private router:Router, private usuarioService: UsuarioService, private socketService: SocketService, private toastr: ToastrService) {
    this.usuarioService.getPerfil().subscribe({
      next: (res) => {
        if (res.perfil.rol == 'Creador') {
          this.router.navigate(['/homeCreador']);
        } else if (res.perfil.rol == 'Participante') {
          this.router.navigate(['/homeParticipante']);
        }
      },
      error: () => {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnInit(): void {
    this.usuarioService.getPerfil().subscribe({
      next: (res) => {
        if (res.perfil.rol == 'Creador') {
          this.router.navigate(['/homeCreador']);
        } else if (res.perfil.rol == 'Participante') {
          this.router.navigate(['/homeParticipante']);
        }
      },
      error: () => {
        this.router.navigate(['/']);
      }
    });
  }

  Mostrar(url: string): boolean {
    return (this.router.url === url);
  }
  
  MostrarRutaSubrutas(url: string): boolean {
    return (this.router.url.startsWith(url));
  }

  UnirseCuestionario() {
   this.router.navigate(['/sesionCuestionario', this.codigoSesion]);
  }
}
