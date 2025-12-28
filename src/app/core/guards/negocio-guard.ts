import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { Rol } from '@/app/features/private/secutiry/perfiles/data/perfil.model';

@Injectable({providedIn: 'root'})
export class NegocioGuard  implements CanActivate{
    constructor(
        private router: Router,
        private globalService: GlobalService,
    ) { }

        canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const rol = this.globalService.getCurrentRol();
        if ((rol === Rol.Administrador) || (rol === Rol.Gestor)  || (rol === Rol.Secretario)|| (rol === Rol.AltaDireccion)){
            return true;
        }

        this.router.navigate(['']);
    }

}
