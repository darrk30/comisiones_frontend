import { createAction, props } from '@ngrx/store';




// login action
export const login = createAction('[Authentication] Login', props<{ usuario: string, clave: string }>());
export const loginSuccess = createAction('[Authentication] Login Success', props<{ usuario: any }>());
export const loginFailure = createAction('[Authentication] Login Failure', props<{ error: any }>());


// logout action
export const logout = createAction('[Authentication] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');


