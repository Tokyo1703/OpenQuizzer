import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { HomeComponent } from './components/home/home.component';
import { HomeCreadorComponent } from './components/home-creador/home-creador.component';
import { HomeParticipanteComponent } from './components/home-participante/home-participante.component';
import { autenticacionGuard, autenticacionGuardCreador, autenticacionGuardParticipante} from './guards/autenticacion.guard';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'homeParticipante', component: HomeParticipanteComponent, canActivate: [autenticacionGuardParticipante]},
    {path: 'homeCreador', component: HomeCreadorComponent, canActivate: [autenticacionGuardCreador]},
    {path: '**', redirectTo: '', pathMatch: 'full'}
];
