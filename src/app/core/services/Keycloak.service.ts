import Keycloak from 'keycloak-js';




// src/app/keycloak.service.ts
import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, Observable, from } from 'rxjs';

import { jwtDecode } from 'jwt-decode';

import { Router } from '@angular/router';
import { GlobalService } from './global.service';

import { TokenStorageService } from './token-storage.service';
import { environment } from 'src/environments/environment';
import { Autenticacion } from 'src/app/store/Authentication/autenticacion.models';
import { Rol } from '@/app/features/private/secutiry/perfiles/data/perfil.model';


@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
    private keycloak!: Keycloak;
    
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public accesoDenegadoSubject = new BehaviorSubject<boolean>(false);

    public currentUsuarioSubject: BehaviorSubject<Autenticacion>;
    public currentUsuario: Observable<Autenticacion>;

    public accesoDenegado$ = this.accesoDenegadoSubject.asObservable();

    // private globalService = inject(GlobalService);
    // private token = inject(TokenStorageService);
    // private router =  inject(Router);

    //private currentUsuarioSubject: BehaviorSubject<Autenticacion>;
    //public currentUsuario: Observable<Autenticacion>;
    private tokenKey = `${environment.appStoragePrefix}token`;  // Donde se almacena el token en localStorage
    private expirationTimer: any;

    private refreshStarted = false;

    constructor(
        private globalService: GlobalService,
        private token: TokenStorageService,
        private router: Router
    ) {
        this.keycloak = new Keycloak({
            url: environment.urlSso, //'https://sso-dev.itp.gob.pe:8080/', // Cambia esto
            realm: environment.realm,     // Tu realm
            clientId: environment.clientId // Tu cliente
        });

        this.currentUsuarioSubject = new BehaviorSubject<Autenticacion>(
            typeof window !== 'undefined' && localStorage.getItem(`${environment.appStoragePrefix}currentUser`)
                ? JSON.parse(localStorage.getItem(`${environment.appStoragePrefix}currentUser`)!)
                : null
            );
        this.currentUsuario = this.currentUsuarioSubject.asObservable();

    }

    public get currentUsuarioValue(): Autenticacion {
        return this.currentUsuarioSubject.value;
    }

    init(): Promise<boolean> {
        if (typeof window === 'undefined') {
            console.warn('SSR detected: skipping Keycloak init');
            return Promise.resolve(false); // o lo que tenga sentido para ti
        }

        return this.keycloak.init({
            //onLoad: 'check-sso',
            checkLoginIframe: false,
            //enableLogging: true
        }).then(authenticated => {
            this.isAuthenticatedSubject.next(authenticated);
            console.log(authenticated);
            if (authenticated) {
                const informacionTotal = this.keycloak.tokenParsed;
                // const permisos = informacionTotal?.authorization?.permissions;

                console.log(informacionTotal);
                

                 if (!informacionTotal || !informacionTotal.resource_access?.[environment.clientId]) {
                    this.accesoDenegadoSubject.next(true);
                    //this.router.navigate(['/auth/acceso-denegado']);
                    return false;
                }
                

                 // Roles por cliente
                const KeycloakRoles = informacionTotal.resource_access?.[environment.clientId];
                if (KeycloakRoles){
                    this.globalService.setRoles(KeycloakRoles.roles as Rol[]);
                    this.globalService.setCurrentRolIndex(0);// Cambiar indice por una funcion que de por defecto el rol con mas permisoss
                }

                

                //console.log(informacionTotal)
                const token = this.getKeycloakInstance().token;
                const ideUsuario  = this.keycloak.tokenParsed?.['sub'];
                const numeroDocumento  = this.keycloak.tokenParsed?.['numeroDocumento'];
                const usuarioNombre = this.getUsername();
                const nombresApellidos = this.keycloak.tokenParsed?.['name'];
                
                if(ideUsuario){
                    this.globalService.setIdeUsuario(ideUsuario);
                }

                if(numeroDocumento){
                    this.globalService.setNumeroDocumento(numeroDocumento);
                }

                if(nombresApellidos){
                    this.globalService.setNombresApellidos(nombresApellidos);
                }

                //console.log("cesar")

                const usuario: any = {
                    expiracion: "2",
                    ideUsuario: ideUsuario,
                    usuario: usuarioNombre,
                    nombresApellidos: nombresApellidos,
                    numeroDocumento: numeroDocumento ,
                    roles: KeycloakRoles.roles,
                    currentRolIndex: 0,
                    token: token
                    // otros campos según tu definición
                };

                

                localStorage.setItem(`${environment.appStoragePrefix}token`, token??'null');
                localStorage.setItem(`${environment.appStoragePrefix}currentUser`, JSON.stringify(usuario));
                
                this.currentUsuarioSubject.next(usuario);
                this.startTokenRefresh();
                
            }

            return authenticated;
        }).catch(err => {
            console.error('Error during Keycloak init:', err);
            return false;
        });
    }

    login(path: string = '/'): void {
        //("Logeo" + window.location.origin + path)
        //this.keycloak.login();
        this.keycloak.login({
            redirectUri: typeof window !== 'undefined' ? window.location.origin + path : ''
        });
    }

    isAuthenticated$(): Observable<boolean> {
        return this.isAuthenticatedSubject.asObservable();
    }

    getKeycloakInstance(): Keycloak {
        return this.keycloak;
    }

    logout(): void {
        //this.keycloak.logout();

        localStorage.removeItem(`${environment.appStoragePrefix}token`);
        // remove user from local storage to log user out
        localStorage.removeItem(`${environment.appStoragePrefix}currentUser`);
        this.isAuthenticatedSubject.next(false);
        this.keycloak.logout({ redirectUri: typeof window !== 'undefined' ? window.location.origin : '' });
    }

    isLoggedIn(): boolean {
        return !!this.keycloak.token;
    }

    // getToken(): string | undefined {
    //     return this.keycloak.token;
    // }
    setToken(token: string) {
        localStorage.setItem(this.tokenKey, token);
        this.startTokenRefresh(); // Te encargarás de renovar el token tú mismo
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getUsername(): string | undefined {
        return this.keycloak.tokenParsed?.['preferred_username'];
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
    
    startTokenRefresh(): void {
        const checkToken = () => {
            this.getKeycloakInstance().updateToken(60).then(refreshed => {
                if (refreshed) {
                    const newToken = this.getKeycloakInstance().token ?? 'null';
                    const user = JSON.parse(localStorage.getItem(`${environment.appStoragePrefix}currentUser`) || '{}');
                    user.token = newToken;
                    localStorage.setItem(`${environment.appStoragePrefix}currentUser`, JSON.stringify(user));
                    localStorage.setItem(`${environment.appStoragePrefix}token`, newToken);
                    console.log('🔄 Token renovado');
                }
                setTimeout(checkToken, 60000); // Vuelve a verificar en 60s
            }).catch(() => {
                console.warn('⚠️ No se pudo renovar el token. Cerrando sesión...');
                this.logout();
            });
        };

        if (!this.refreshStarted) {
            this.refreshStarted = true;
            checkToken();
        }
    }
}
