import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, exhaustMap, tap, first } from 'rxjs/operators';
import { from, of } from 'rxjs';
//import { AuthenticationService } from '../../core/services/auth.service';
import { login, loginSuccess, loginFailure, logout, logoutSuccess} from './authentication.actions';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
// import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
// import { UserProfileService } from 'src/app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AutenticacionService } from 'src/app/core/services/autenticacion.service';

@Injectable()
export class AuthenticationEffects {

	login$ = createEffect(() =>
		this.actions$.pipe(
			ofType(login),
			exhaustMap(({ usuario, clave }) => {
				this.spinner.show();
				return this.autenticacionService.login(usuario, clave).pipe(
					map((usuario) => {
						if (usuario) {
							localStorage.setItem(`${environment.appStoragePrefix}currentUser`, JSON.stringify(usuario));
							localStorage.setItem(`${environment.appStoragePrefix}token`, usuario.token);
							this.autenticacionService.setToken();
							this.router.navigate(['/']);
						}
						this.spinner.hide();
						return loginSuccess({ usuario });
					}),
					catchError((error) => {
						this.toastr.warning('Usuario y/o Clave incorrecto', 'Advertencia', {
							timeOut: 2000,  positionClass: 'toast-bottom-right',
						}); 
						this.spinner.hide();
						return of(loginFailure({ error }))
					}, // Closing parenthesis added here
				));
			})
		)
	);


	logout$ = createEffect(() =>
		this.actions$.pipe(
			ofType(logout),
			tap(() => {
				// Perform any necessary cleanup or side effects before logging out
			}),
			exhaustMap(() => of(logoutSuccess()))
		)
	);

	constructor(
		@Inject(Actions) private actions$: Actions,
		private autenticacionService: AutenticacionService,
		// private AuthenticationService: AuthenticationService,
		// private AuthfakeService: AuthfakeauthenticationService,
		// private userService: UserProfileService,
		private router: Router,
		private toastr:ToastrService,
		private spinner :NgxSpinnerService
	) { }

}