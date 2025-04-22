import { CanActivateFn } from '@angular/router';
import { UsuarioService } from '../services/usuario/usuario.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Location } from '@angular/common';

export const autenticacionGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);
  const location = inject(Location);
  
  return usuarioService.getPerfil().pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  )
  
};

export const autenticacionGuardCreador: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);
  const location = inject(Location);
  
  return usuarioService.getPerfil().pipe(
    map((res) => {
      if(res.perfil.rol == "Creador"){
        return true
      }
      router.navigate(['/homeParticipante]'])
      return false
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  )

}

export const autenticacionGuardParticipante: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);
  const location = inject(Location);
  
  return usuarioService.getPerfil().pipe(
    map((res) => {
      if(res.perfil.rol == "Participante"){
        return true
      }
      router.navigate(['/homeCreador'])
      return false
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  )
}


