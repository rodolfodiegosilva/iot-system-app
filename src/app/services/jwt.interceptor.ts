import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class JwtInterceptorService implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access_token');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      console.log('JwtInterceptorService: no token found');
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('JwtInterceptorService: error occurred', error);
        if (error.status === 401) {
          console.log(
            'JwtInterceptorService: 401 Unauthorized, removing token and redirecting to login'
          );
          localStorage.removeItem('access_token');
          this.router
            .navigate(['/login'])
            .then(() => {
              console.log('JwtInterceptorService: navigated to login');
            })
            .catch((navError) => {
              console.error(
                'JwtInterceptorService: navigation error',
                navError
              );
            });
        }
        return throwError(() => error);
      })
    );
  }
}
