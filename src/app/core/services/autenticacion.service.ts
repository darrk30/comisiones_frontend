import { jwtDecode } from 'jwt-decode';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


import { environment } from 'src/environments/environment';

import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';
import { Autenticacion } from 'src/app/store/Authentication/autenticacion.models';
import { GlobalService } from './global.service';

@Injectable({ providedIn: 'root' })
export class AutenticacionService {
    urlBackend = `${environment.urlBackend}/api`;
    private currentUsuarioSubject: BehaviorSubject<Autenticacion>;
    public currentUsuario: Observable<Autenticacion>;
    private tokenKey = `${environment.appStoragePrefix}token`;  // Donde se almacena el token en localStorage
    private expirationTimer: any;

    constructor(
        private http: HttpClient,
        private globalService: GlobalService,
        private token: TokenStorageService,
        private router: Router
    ) {
        this.currentUsuarioSubject = new BehaviorSubject<Autenticacion>(JSON.parse(localStorage.getItem(`${environment.appStoragePrefix}currentUser`)));
        this.currentUsuario = this.currentUsuarioSubject.asObservable();
    }

    public get currentUsuarioValue(): Autenticacion {
        return this.currentUsuarioSubject.value;
    }

    login(usuario: string, clave: string) {
        return this.http.post<any>(`${this.urlBackend}/autenticacion`, { usuario, clave })
            .pipe(map(usuario => {
                // login successful if there's a jwt token in the response
                if (usuario && usuario.token) {
                    this.globalService.setNombresApellidos(usuario.nombresApellidos);
                    this.globalService.setNumeroDocumento(usuario.numeroDocumento);
                    this.globalService.setIdeUsuario(usuario.ideUsuario);

                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem(`${environment.appStoragePrefix}currentUser`, JSON.stringify(usuario));
                    this.currentUsuarioSubject.next(usuario);
                }
                return usuario;
            }));
    }

    logout() {
        localStorage.removeItem(`${environment.appStoragePrefix}token`);
        // remove user from local storage to log user out
        localStorage.removeItem(`${environment.appStoragePrefix}currentUser`);
        this.currentUsuarioSubject.next(null);
        this.router.navigate(['auth/sso']);
    }


    setToken() {
        //localStorage.setItem(this.tokenKey, token);
        this.startTokenExpirationTimer();
    }
    
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }
    
      // Decodificar el token JWT
    decodeToken(token: string): any {
        return jwtDecode(token);
    }
    
      // Verifica si el token ha expirado
    isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token) return true;

        const decodedToken: any = this.decodeToken(token);
        const expirationDate = new Date(decodedToken.exp * 1000);
        return expirationDate < new Date();
    }
    
      // Establece un temporizador para cerrar sesión cuando el token expire
    startTokenExpirationTimer() {
        const token = this.token.getToken();
        const decodedToken: any = this.decodeToken(token);
        const expirationDate = new Date(decodedToken.exp * 1000);
        const expirationDuration = expirationDate.getTime() - new Date().getTime();
      
        console.log('Token expirará en:', expirationDuration / 1000, 'segundos');
      
        if (this.expirationTimer) {
            clearTimeout(this.expirationTimer);
        }
      
        // Si el temporizador es menor o igual a cero, el token ya expiró
        if (expirationDuration <= 0) {
            this.logout();
            return;
        }
      
        this.expirationTimer = setTimeout(() => {
            console.log('Token ha expirado. Cerrando sesión.');
            this.logout();
        }, expirationDuration);
    }
}
