import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { HomeComponent } from './components/home/home.component';
import { HomeCreadorComponent } from './components/home-creador/home-creador.component';
import { HomeParticipanteComponent } from './components/home-participante/home-participante.component';
import { autenticacionGuard, autenticacionGuardCreador, autenticacionGuardParticipante} from './guards/autenticacion.guard';
import { CreacionCuestionarioComponent } from './components/creacion-cuestionario/creacion-cuestionario.component';
import { RealizarCuestionarioIndividualComponent } from './components/realizar-cuestionario-individual/realizar-cuestionario-individual.component';

export const routes: Routes = [
    
    {path: 'login', component: LoginComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'homeParticipante', component: HomeParticipanteComponent, canActivate: [autenticacionGuardParticipante]},
    {path: 'homeCreador', component: HomeCreadorComponent, canActivate: [autenticacionGuardCreador],
        children: [
            {path:'crearCuestionario', component: CreacionCuestionarioComponent, canActivate: [autenticacionGuardCreador]},
            {path: 'realizarCuestionarioIndividual/:id', component: RealizarCuestionarioIndividualComponent},
        ]
    },
    {path: 'realizarCuestionarioIndividual/:id', component: RealizarCuestionarioIndividualComponent},
    {path: '**', redirectTo: '', pathMatch: 'full'}
];
