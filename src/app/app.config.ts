import { APP_INITIALIZER, ApplicationConfig, enableProdMode, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// AngularFire imports
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';


// Other module imports
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideToastr } from 'ngx-toastr';
import { provideStore, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { rootReducer } from './store';
import { AuthenticationEffects } from './store/Authentication/authentication.effects';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { KeycloakService } from './core/services/Keycloak.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs);

export function createTranslateLoader(http: HttpClient): any {
  	return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export function initializeKeycloak(keycloakService: KeycloakService): () => Promise<boolean> {
  	return () => keycloakService.init();
}

export const appConfig: ApplicationConfig = {
	providers: [
		NgxSpinnerService,
		provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
		provideStore(rootReducer),
		// provideEffects(
		// [
		// 	AuthenticationEffects,
		// ]),
		KeycloakService,
		{
			provide: APP_INITIALIZER,
			useFactory: initializeKeycloak,
			deps: [KeycloakService],
			multi: true
		},
		provideHttpClient(withInterceptorsFromDi()),
		importProvidersFrom(
			TranslateModule.forRoot({
				loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient]
				}
			}),
			ModalModule.forRoot()
		),
		provideAnimations(),
		provideToastr(),
		{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }
	]
};

