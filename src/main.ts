import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { enableProdMode, LOCALE_ID } from '@angular/core';
import { initFirebaseBackend } from './app/authUtils';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { JwtInterceptor } from './app/core/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './app/core/interceptors/error.interceptor';
import { ModalModule } from 'ngx-bootstrap/modal';
// Enable production mode if in production environment
if (environment.production) {
    enableProdMode();
}

// if (environment.defaultauth === 'firebase') {
//     initFirebaseBackend(environment.firebaseConfig);
// } else {
//     FakeBackendInterceptor;
// }

bootstrapApplication(AppComponent, {
	providers: [
		provideHttpClient(),
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		{ provide: LOCALE_ID, useValue: 'es-PE' },
		...appConfig.providers
	]
})
.catch((err) => console.error('Error during bootstrapping the application:', err));

