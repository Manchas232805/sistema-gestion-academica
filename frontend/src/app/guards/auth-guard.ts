import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const usuario = sessionStorage.getItem('usuario');
  const rol = sessionStorage.getItem('rol');

  if (usuario && rol === 'ADMIN') {
    return true;
  }

  return router.createUrlTree(['/login']);
};
