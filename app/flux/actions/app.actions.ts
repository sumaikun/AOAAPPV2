import { Action } from '@ngrx/store';


export enum AppActionTypes {
  IS_FETCHING = '[App] FETCH',
  SET_SURVEYS = '[App] SURVEYS',
  SET_ACT = '[App] ACT',
}

export class IsFetching implements Action {
    readonly type = AppActionTypes.IS_FETCHING;
    constructor(public payload: boolean) { }
}

export class SetSurveys implements Action {
  readonly type = AppActionTypes.SET_SURVEYS;
  constructor(public payload: any) {}
}

export class SetAct implements Action {
  readonly type = AppActionTypes.SET_ACT;
  constructor(public payload: any) {}
}

export type All =
    | IsFetching
    | SetSurveys 
    | SetAct ;
