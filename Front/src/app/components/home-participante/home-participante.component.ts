import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home-participante',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './home-participante.component.html',
  styleUrl: './home-participante.component.css'
})
export class HomeParticipanteComponent {
  constructor(private router:Router) {}
  MostrarRutaSubrutas(url: string): boolean {
    return (this.router.url.startsWith(url));
  }

}
