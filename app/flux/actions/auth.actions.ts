import { Action } from '@ngrx/store';
import { Login } from '../../models/Login';

export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAILURE = '[Auth] Login Failure',
  LOGOUT = '[Auth] Logout',
  SET_USER_DATA = '[Auth] SET_USER_DATA',
}

export class LogIn implements Action {
    readonly type = AuthActionTypes.LOGIN;
    constructor(public payload: Login) { }
}

export class LogInSuccess implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;
  constructor(public payload: any) {}
}

export class LogInFailure implements Action {
  readonly type = AuthActionTypes.LOGIN_FAILURE;
  constructor(public payload: any) {}
}

export class LogOut implements Action {
  readonly type = AuthActionTypes.LOGOUT;
}

export class SetUserData implements Action {
  readonly type = AuthActionTypes.SET_USER_DATA;
  constructor(public payload: any) {}
}

export type All =
    | LogIn
    | LogInSuccess
    | LogInFailure
    | LogOut
    | SetUserData;
