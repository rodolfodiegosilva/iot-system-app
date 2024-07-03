import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard: Checking authentication status');
  console.log('Current URL:', state.url);
  console.log('User is logged in:', authService.isLoggedIn());

  if (authService.isLoggedIn()) {
    if (state.url === '/login' || state.url === '/register') {
      console.log('User is already logged in, redirecting to /monitorings');
      router.navigate(['/monitorings']);
      return false;
    }
    console.log('User is logged in, allowing access');
    return true;
  } else {
    if (state.url === '/login' || state.url === '/register') {
      console.log('User is not logged in, allowing access to login/register');
      return true;
    }
    console.log('User is not logged in, redirecting to /login');
    router.navigate(['/login']);
    return false;
  }
};
