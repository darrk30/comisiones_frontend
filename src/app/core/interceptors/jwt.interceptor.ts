import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AutenticacionService } from '../services/autenticacion.service';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private autenticacionService: AutenticacionService,
        private token: TokenStorageService,
    ) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = this.token.getToken();

        if (token && this.autenticacionService.isTokenExpired()) {
            this.autenticacionService.logout();
            return throwError(() => new Error('Token expired'));
        }

        //if (environment.defaultauth === 'firebase') {
            // add authorization header with jwt token if available
          
            // add authorization header with jwt token if available
        const currentUser = this.autenticacionService.currentUsuarioValue;
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });
        }
        return next.handle(request).pipe(
            catchError(err => {
              if (err.status === 401) {
                this.autenticacionService.logout();
              }
              return throwError(err);
            })
        );
    }
}
