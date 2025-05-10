import { Component, OnInit} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { UsuarioService } from './services/usuario/usuario.service';
import { Router } from '@angular/router';
import { MenuPerfilComponent } from "./components/menu-perfil/menu-perfil.component";
import { FormsModule } from '@angular/forms';
import { ListaCuestionariosComponent } from "./components/lista-cuestionarios/lista-cuestionarios.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, MenuPerfilComponent, FormsModule, ListaCuestionariosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  codigoCuestionario: string="";

  constructor(private router:Router, private usuarioService: UsuarioService) {}

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

  }
}
