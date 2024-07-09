import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    if (state.url === '/login' || state.url === '/register') {
      router.navigate(['/monitorings']);
      return false;
    }
    return true;
  } else {
    if (state.url === '/login' || state.url === '/register') {
      return true;
    }
    router.navigate(['/login']);
    return false;
  }
};
