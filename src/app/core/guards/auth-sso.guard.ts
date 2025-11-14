import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, take, tap } from 'rxjs';
import { KeycloakService } from '../services/Keycloak.service';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class KeycloakSsoGuard implements CanActivate {

    constructor(private keycloakService: KeycloakService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        const currentUser = this.keycloakService.currentUsuarioValue;

        if (!currentUser || !currentUser.token) {
            return Promise.resolve(this.router.parseUrl('/auth/sso'));
        }

        const token = currentUser.token;
        const helper = new JwtHelperService();

        if (!helper.isTokenExpired(token)) {
            return Promise.resolve(true);
        }

        console.warn('🔁 Token expirado detectado. Intentando renovar...');

        return this.keycloakService.getKeycloakInstance().updateToken(60)
            .then(refreshed => {
                if (refreshed) {
                    const newToken = this.keycloakService.getKeycloakInstance().token??"null";
                    const updatedUser = { ...currentUser, token: newToken };
                    localStorage.setItem(`${environment.appStoragePrefix}token`, newToken);
                    localStorage.setItem(`${environment.appStoragePrefix}currentUser`, JSON.stringify(updatedUser));
                    this.keycloakService.currentUsuarioSubject.next(updatedUser);
                    return true;
                } else {
                    localStorage.removeItem(`${environment.appStoragePrefix}token`);
                    localStorage.removeItem(`${environment.appStoragePrefix}currentUser`);
                    return this.router.parseUrl('/auth/sso');
                }
            })
            .catch(() => {
                localStorage.removeItem(`${environment.appStoragePrefix}token`);
                localStorage.removeItem(`${environment.appStoragePrefix}currentUser`);
                return this.router.parseUrl('/auth/sso');
            });
    }

}