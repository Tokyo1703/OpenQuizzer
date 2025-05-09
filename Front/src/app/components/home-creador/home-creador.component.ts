import { Component } from '@angular/core';
import { RouterModule, RouterOutlet, Router} from '@angular/router';

@Component({
  selector: 'app-home-creador',
  imports: [RouterModule, RouterOutlet],
  templateUrl: './home-creador.component.html',
  styleUrl: './home-creador.component.css'
})
export class HomeCreadorComponent {
  
  constructor(private router:Router) {}

  Mostrar(url: string): boolean {
    return (this.router.url === url);
  }

  MostrarRutaSubrutas(url: string): boolean {
    return (this.router.url.startsWith(url));
  }


}
