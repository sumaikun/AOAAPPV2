import { createFeatureSelector } from '@ngrx/store';

import * as auth from './reducers/auth.reducers';
import * as app from './reducers/app.reducers';
import * as offices from './reducers/offices.reducers';
import * as citas from './reducers/citas.reducers';

export interface AppState {
    authState: auth.State;
    appState: app.State;
    officeState: offices.State;
    citas: citas.State
}

export const reducers = {
  auth: auth.reducer,
  app: app.reducer,
  offices: offices.reducer,
  citas: citas.reducer
};



export const selectAuthState = createFeatureSelector<AppState>('auth');

export const selectAppState = createFeatureSelector<AppState>('app');

export const selectOfficeState = createFeatureSelector<AppState>('offices');

export const selectCitasState = createFeatureSelector<AppState>('citas');
