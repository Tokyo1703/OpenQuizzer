import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { HomeCreadorComponent } from './components/home-creador/home-creador.component';
import { HomeParticipanteComponent } from './components/home-participante/home-participante.component';
import { autenticacionGuard, autenticacionGuardCreador, autenticacionGuardParticipante} from './guards/autenticacion.guard';
import { CreacionCuestionarioComponent } from './components/creacion-cuestionario/creacion-cuestionario.component';
import { RealizarCuestionarioIndividualComponent } from './components/realizar-cuestionario-individual/realizar-cuestionario-individual.component';
import { ListaCuestionariosComponent } from './components/lista-cuestionarios/lista-cuestionarios.component';
import { ListaResultadosIndividualesComponent } from './components/lista-resultados-individuales/lista-resultados-individuales.component';
import { AppComponent } from './app.component';
import { ResultadoIndividualCompletoComponent } from './components/resultado-individual-completo/resultado-individual-completo.component';
import { ListaCuestionariosCreadorComponent } from './components/lista-cuestionarios-creador/lista-cuestionarios-creador.component';
import { PerfilComponent } from './components/perfil/perfil.component';

export const routes: Routes = [
    {path: '', component: AppComponent},
    {path: 'login', component: LoginComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'homeParticipante', component: HomeParticipanteComponent, canActivate: [autenticacionGuardParticipante],
        children: [
            {path: '', redirectTo: 'publicos', pathMatch: 'full' },
            {path: 'publicos', component: ListaCuestionariosComponent, canActivate: [autenticacionGuardParticipante]},
            {path: 'resultadosIndividuales', component: ListaResultadosIndividualesComponent, canActivate: [autenticacionGuard]},
            {path: 'resultadoIndividualCompleto/:id', component: ResultadoIndividualCompletoComponent, canActivate: [autenticacionGuard]}
            ]
    },
    {path: 'homeCreador', component: HomeCreadorComponent, canActivate: [autenticacionGuardCreador],
        children: [
            {path: '', redirectTo: 'publicos', pathMatch: 'full' },
            {path: 'crearCuestionario', component: CreacionCuestionarioComponent, canActivate: [autenticacionGuardCreador]},
            {path: 'realizarCuestionarioIndividual/:id', component: RealizarCuestionarioIndividualComponent, canActivate: [autenticacionGuardCreador]},
            {path: 'publicos', component: ListaCuestionariosComponent, canActivate: [autenticacionGuardCreador]},
            {path: 'cuestionariosCreados', component: ListaCuestionariosCreadorComponent, canActivate: [autenticacionGuardCreador]},
            {path: 'resultadosIndividuales', component: ListaResultadosIndividualesComponent, canActivate: [autenticacionGuard]},
            {path: 'resultadoIndividualCompleto/:id', component: ResultadoIndividualCompletoComponent, canActivate: [autenticacionGuard]}
        ]
    },
    {path: 'perfil', component: PerfilComponent, canActivate: [autenticacionGuard]},
    
    {path: 'realizarCuestionarioIndividual/:id', component: RealizarCuestionarioIndividualComponent},
    {path: '**', redirectTo: '', pathMatch: 'full'}
];
