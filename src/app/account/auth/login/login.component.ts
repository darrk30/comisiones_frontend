import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { login } from 'src/app/store/Authentication/authentication.actions';
import { CommonModule } from '@angular/common';
import { RecaptchaModule } from "ng-recaptcha";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone:true,
  imports:[CommonModule,FormsModule,ReactiveFormsModule,RecaptchaModule]
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {

	keyCaptcha: String = environment.siteKeyCaptcha;
	captchaResolved: boolean = false;
	loginForm: UntypedFormGroup;
	submitted: any = false;
	error: any = '';
	returnUrl: string;
	fieldTextType!: boolean;

	// set the currenr year
	year: number = new Date().getFullYear();

	// tslint:disable-next-line: max-line-length
	constructor(
		private formBuilder: UntypedFormBuilder, 
		private router: Router, 
		private store: Store,
	) { }

	ngOnInit() {
		if (localStorage.getItem(`${environment.appStoragePrefix}currentUser`)) {
			this.router.navigate(['/']);
		}
		// form validation
		this.loginForm = this.formBuilder.group({
			usuario: ['', [Validators.required]],
			clave: ['', [Validators.required]],
		});
	}

	// convenience getter for easy access to form fields
	get f() { 
		return this.loginForm.controls; 
	}

	/**
	 * Form submit
	 */
	onSubmit() {
		this.submitted = true;

		const usuario = this.f['usuario'].value; // Get the username from the form
		const clave = this.f['clave'].value; // Get the password from the form
		
		// Login Api
		this.store.dispatch(login({ usuario: usuario, clave: clave }));
	}

	/**
	 * Password Hide/Show
	 */
	toggleFieldTextType() {
		this.fieldTextType = !this.fieldTextType;
	}

	checkCaptcha(captchaResponse: string) {
		this.captchaResolved = (captchaResponse && captchaResponse.length > 0) ? true : false;
	}
}
