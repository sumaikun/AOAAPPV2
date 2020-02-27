import { User } from '../../models/User';
import { Login } from '../../models/Login';

import { AuthActionTypes, All } from '../actions/auth.actions';
import { ACTIONS_SUBJECT_PROVIDERS } from '@ngrx/store/src/actions_subject';

export interface State {
    // is a user authenticated?
    isAuthenticated: boolean;
    // if authenticated, there should be a user object
    userData: User | null;
    //login Data
    login: Login | null;
    // error message
    errorMessage: string | null;
}

export const initialState: State = {
    isAuthenticated: false,
    userData: null,
    login: null,
    errorMessage: null
};

export function reducer(state = initialState, action: All): State {
  //console.log("get into  auth reducer");
  switch (action.type) {
    case AuthActionTypes.LOGIN_SUCCESS: {

      //console.log("login success");

      state = {
        ...state,
        isAuthenticated: true,
        userData:action.payload,
        errorMessage: null
      };

      //console.log(state);

      return state;
    }
    case AuthActionTypes.LOGIN_FAILURE: {
      return {
        ...state,
        errorMessage: 'Incorrect email and/or password.'
      };
    }
    case AuthActionTypes.SET_USER_DATA: {
      return {
        ...state,
        userData: action.payload
      };
    }
    case AuthActionTypes.LOGOUT: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
