import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { changesLayout } from 'src/app/store/layouts/layout.actions';
import { getLayoutMode } from 'src/app/store/layouts/layout.selector';
import { RootReducerState } from 'src/app/store';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SimplebarAngularModule } from 'simplebar-angular';
import { AutenticacionService } from 'src/app/core/services/autenticacion.service';
import { GlobalService } from 'src/app/core/services/global.service';

@Component({
	selector: 'app-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.scss'],
	standalone:true,
	imports:[CommonModule,TranslateModule,BsDropdownModule,SimplebarAngularModule],
})

/**
 * Topbar component
 */
export class TopbarComponent implements OnInit {
	mode: any
	element: any;
	cookieValue: any;
	flagvalue: any;
	valueset: any;
	theme: any;
	layout: string;
	dataLayout$: Observable<string>;
	nombresApellidos: string;
	nombreLargoSistema: string;
	roles: string[];
	currentRolIndex: number;
	//nombreCortoSistema: string;
	// Define layoutMode as a property

	constructor(
		@Inject(DOCUMENT) private document: any, 
		private router: Router,
		private autenticacionService: AutenticacionService,
		private globalService: GlobalService,
		public translate: TranslateService,
		public _cookiesService: CookieService, 
		public store: Store<RootReducerState>
	) {
		this.nombresApellidos = this.globalService.getNombresApellidos();
		this.roles = this.globalService.getRoles().map((rol)=> rol.split("_")[2]);
		this.currentRolIndex = this.globalService.getCurrentRolIndex();
	}

	openMobileMenu: boolean;

	@Output() settingsButtonClicked = new EventEmitter();
	@Output() mobileMenuButtonClicked = new EventEmitter();

	ngOnInit() {
		// this.initialAppState = initialState;
		this.store.select('layout').subscribe((data) => {
			this.theme = data.DATA_LAYOUT;
		})
		this.openMobileMenu = false;
		this.element = document.documentElement;

	}

	get currentRol(){
		return this.roles[this.currentRolIndex];
	}

	/**
	 * Toggles the right sidebar
	 */
	toggleRightSidebar() {
		this.settingsButtonClicked.emit();
	}

	/**
	 * Toggle the menu bar when having mobile screen
	 */
	toggleMobileMenu(event: any) {
		event.preventDefault();
		this.mobileMenuButtonClicked.emit();
	}

	/**
	 * Logout the user
	 */
	logout() {
		this.autenticacionService.logout();
		this.router.navigate(['/auth/sso']);
	}

	/**
	 * Fullscreen method
	 */
	fullscreen() {
		document.body.classList.toggle('fullscreen-enable');
		if (
		!document.fullscreenElement && !this.element.mozFullScreenElement &&
		!this.element.webkitFullscreenElement) {
		if (this.element.requestFullscreen) {
			this.element.requestFullscreen();
		} else if (this.element.mozRequestFullScreen) {
			/* Firefox */
			this.element.mozRequestFullScreen();
		} else if (this.element.webkitRequestFullscreen) {
			/* Chrome, Safari and Opera */
			this.element.webkitRequestFullscreen();
		} else if (this.element.msRequestFullscreen) {
			/* IE/Edge */
			this.element.msRequestFullscreen();
		}
		} else {
		if (this.document.exitFullscreen) {
			this.document.exitFullscreen();
		} else if (this.document.mozCancelFullScreen) {
			/* Firefox */
			this.document.mozCancelFullScreen();
		} else if (this.document.webkitExitFullscreen) {
			/* Chrome, Safari and Opera */
			this.document.webkitExitFullscreen();
		} else if (this.document.msExitFullscreen) {
			/* IE/Edge */
			this.document.msExitFullscreen();
		}
		}
	}

	changeLayout(layoutMode: string) {
		this.theme = layoutMode;
		this.store.dispatch(changesLayout({ layoutMode }));
		this.store.select(getLayoutMode).subscribe((layout) => {
		document.documentElement.setAttribute('data-layout', layout)
		})
	}

	cambiarRol(){
		this.currentRolIndex = (this.currentRolIndex + 1) % this.roles.length;
		if (!(["ADMINISTRADOR", "SUPERVISOR", "COORDINADOR"].includes(this.currentRol))){
			this.currentRolIndex = (this.currentRolIndex + 1) % this.roles.length;
		}
		this.globalService.setCurrentRolIndex(this.currentRolIndex);
		window.location.reload();
	}

}