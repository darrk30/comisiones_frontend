
import { Rol } from '@/app/features/private/secutiry/perfiles/data/perfil.model';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class GlobalService {
	
	ideUsuario: string;
	nombresApellidos: string;
	numeroDocumento: string;
	nombreLargoSistema: string;
	nombreCortoSistema: string;
	roles: Rol[] = [];
	currentRolIndex = 0;

	constructor(){
		const storedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(`${environment.appStoragePrefix}currentUser`) ?? 'null'): null;

		this.setNombresApellidos(storedUser?.nombresApellidos);
		this.setNumeroDocumento(storedUser?.numeroDocumento);
		this.setIdeUsuario(storedUser?.ideUsuario);
		this.setRoles(storedUser?.roles);
		this.setCurrentRolIndex(storedUser?.currentRolIndex);
		this.setNombreLargoSistema(environment.longNameSystem);
		this.setNombreCortoSistema(environment.shortNameSystem);
	}


	setIdeUsuario(ideUsuario:string){
		this.ideUsuario = ideUsuario;
	}

	getIdeUsuario(){
		return this.ideUsuario;
	}

	setNombresApellidos(nombresApellidos:string){
		this.nombresApellidos = nombresApellidos;
	}

	getNombresApellidos(){
		return this.nombresApellidos;
	}

	setNumeroDocumento(numeroDocumento:string){
		this.numeroDocumento = numeroDocumento;
	}

	getNumeroDocumento(){
		return this.numeroDocumento;
	}

	setNombreLargoSistema(nombreLargoSistema:string){
		this.nombreLargoSistema = nombreLargoSistema;
	}

	getNombreLargoSistema(){
		return this.nombreLargoSistema;
	}

	setNombreCortoSistema(nombreCortoSistema:string){
		this.nombreCortoSistema = nombreCortoSistema;
	}

	getNombreCortoSistema(){
		return this.nombreCortoSistema;
	}

	setRoles(roles: Rol[]){
		this.roles = roles;
	}

	getRoles(){
		return this.roles;
	}

	setCurrentRolIndex(index: number){
		const storedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(`${environment.appStoragePrefix}currentUser`) ?? 'null'): null;
		if(storedUser){
			storedUser.currentRolIndex = index
		}
		localStorage.setItem(`${environment.appStoragePrefix}currentUser`, JSON.stringify(storedUser));

		this.currentRolIndex = index;
	}

	getCurrentRolIndex(){
		return this.currentRolIndex;
	}
	
	getCurrentRol(){
		return this.roles[this.currentRolIndex];
	}
}
