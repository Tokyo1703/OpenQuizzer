import { Component } from '@angular/core';
import { RouterModule, RouterOutlet, Router} from '@angular/router';
import { ListaCuestionariosComponent } from '../lista-cuestionarios/lista-cuestionarios.component';

@Component({
  selector: 'app-home-creador',
  imports: [RouterModule, RouterOutlet, ListaCuestionariosComponent],
  templateUrl: './home-creador.component.html',
  styleUrl: './home-creador.component.css'
})
export class HomeCreadorComponent {

  constructor(private router:Router) {}

  Mostrar(url: string): boolean {
    return (this.router.url === url);
  }
}
