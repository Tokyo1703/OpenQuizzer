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
import { SesionCuestionarioComponent } from './components/sesion-cuestionario/sesion-cuestionario.component';
import { SesionCuestionarioCreadorComponent } from './components/sesion-cuestionario-creador/sesion-cuestionario-creador.component';
import { ListaResultadosGrupalesComponent } from './components/lista-resultados-grupales/lista-resultados-grupales.component';
import { ResultadoGrupalCompletoComponent } from './components/resultado-grupal-completo/resultado-grupal-completo.component';
import { EditarCuestionarioComponent } from './components/editar-cuestionario/editar-cuestionario.component';
import { BuzonComponent } from './components/buzon/buzon.component';

export const routes: Routes = [
    {
    path: '',
    component: AppComponent,
    canActivate: [ autenticacionGuard ],  
    children: [
      { path: '', component: ListaCuestionariosComponent,canActivate: [ autenticacionGuard ] },  
      { path: 'login', component: LoginComponent, canActivate: [ autenticacionGuard ]},
      { path: 'registro', component: RegistroComponent, canActivate: [ autenticacionGuard ] },
      { path: 'buzon', component: BuzonComponent},
    ]
    },
    {path: 'homeParticipante', component: HomeParticipanteComponent, canActivate: [autenticacionGuardParticipante],
        children: [
            {path: '', redirectTo: 'publicos', pathMatch: 'full' },
            {path: 'publicos', component: ListaCuestionariosComponent, canActivate: [autenticacionGuardParticipante]},
            {path: 'resultadosIndividuales', component: ListaResultadosIndividualesComponent, canActivate: [autenticacionGuardParticipante]},
            {path: 'resultadoIndividualCompleto/:id', component: ResultadoIndividualCompletoComponent, canActivate: [autenticacionGuardParticipante]},
            {path: 'perfil', component: PerfilComponent, canActivate: [autenticacionGuardParticipante]},
            {path: 'buzon', component: BuzonComponent},
            ]
    },
    {path: 'homeCreador', component: HomeCreadorComponent, canActivate: [autenticacionGuardCreador],
        children: [
            {path: '', redirectTo: 'publicos', pathMatch: 'full' },
            {path: 'crearCuestionario', component: CreacionCuestionarioComponent, canActivate: [autenticacionGuardCreador]},
            {path: 'modificarCuestionario/:id', component: EditarCuestionarioComponent, canActivate: [autenticacionGuardCreador]},
            {path: 'realizarCuestionarioIndividual/:id', component: RealizarCuestionarioIndividualComponent, canActivate: [autenticacionGuardCreador]},
            {path: 'publicos', component: ListaCuestionariosComponent, canActivate: [autenticacionGuardCreador]},
            {path: 'cuestionariosCreados', component: ListaCuestionariosCreadorComponent, canActivate: [autenticacionGuardCreador]},
            {path: 'resultadosIndividuales', component: ListaResultadosIndividualesComponent, canActivate: [autenticacionGuardCreador]},
            {path: 'resultadosGrupales', component: ListaResultadosGrupalesComponent, canActivate: [autenticacionGuardCreador]},
            {path: 'resultadoIndividualCompleto/:id', component: ResultadoIndividualCompletoComponent, canActivate: [autenticacionGuardCreador]},
            {path: 'resultadoGrupalCompleto/:id', component: ResultadoGrupalCompletoComponent, canActivate: [autenticacionGuardCreador]},
            {path: 'perfil', component: PerfilComponent, canActivate: [autenticacionGuardCreador]},
            {path: 'buzon', component: BuzonComponent},
        ]
    },
    
    {path: 'sesionCuestionarioCreador/:id', component: SesionCuestionarioCreadorComponent, canActivate: [autenticacionGuardCreador]},
    {path: 'sesionCuestionario/:codigo', component: SesionCuestionarioComponent},
    {path: 'realizarCuestionarioIndividual/:id', component: RealizarCuestionarioIndividualComponent},
    {path: '**', redirectTo: '', pathMatch: 'full'}
];
