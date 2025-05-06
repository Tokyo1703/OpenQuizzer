import { Component} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { UsuarioService } from './services/usuario/usuario.service';
import { Router } from '@angular/router';
import { MenuCreadorComponent } from "./components/menu-creador/menu-creador.component";
import { FormsModule } from '@angular/forms';
import { ListaCuestionariosComponent } from "./components/lista-cuestionarios/lista-cuestionarios.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, MenuCreadorComponent, FormsModule, ListaCuestionariosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent{
  codigoCuestionario: string="";

  constructor(private router:Router) {}

  Mostrar(url: string): boolean {
    return (this.router.url === url);
  }
  
  MostrarRutaSubrutas(url: string): boolean {
    return (this.router.url.startsWith(url));
  }

  UnirseCuestionario() {

  }
}
