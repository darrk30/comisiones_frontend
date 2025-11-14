
import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { KeycloakService } from 'src/app/core/services/Keycloak.service';

@Component({
	selector: 'app-sso',
	standalone:true,
	imports: [NgIf],
	templateUrl: './sso.component.html',
	styleUrl: './sso.component.css'
})
export class SsoComponent {
	private keycloakService = inject(KeycloakService);
	isReady = false;
	showAccessDenied = false;
	year: number = new Date().getFullYear();
	constructor(){
		//console.log("Logeo")
	}

	ngOnInit(): void {
		this.isReady = true;
		// this.keycloakService.init$().subscribe(auth => {
		//   	this.isReady = true;
		// });

		// this.keycloakService.isAuthenticated$().subscribe(auth => {
		// 	this.isReady = auth;
		// });
		this.keycloakService.accesoDenegado$.subscribe(denegado => {
			this.showAccessDenied = denegado;
		});
	}

	login(): void {
		
		if (!this.keycloakService) {
			console.error('Keycloak no está inicializado.');
			return;
		}

		this.keycloakService.logout();

		this.keycloakService.login();
	}
}
