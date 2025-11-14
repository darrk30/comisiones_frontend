import { createReducer, on } from '@ngrx/store';
import {  login, loginFailure, loginSuccess, logout } from './authentication.actions';


export interface AuthenticationState {
    isLoggedIn: boolean;
    error: string | null;
}

const initialState: AuthenticationState = {
    isLoggedIn: false,
    error: null,
};

export const authenticationReducer = createReducer(
    initialState,
    on(login, (state) => ({ ...state, error: null })),
    on(loginSuccess, (state, { usuario }) => ({ ...state, isLoggedIn: true, usuario, error: null, })),
    on(loginFailure, (state, { error }) => ({ ...state, error })),
    on(logout, (state) => ({ ...state, user: null })),


);
