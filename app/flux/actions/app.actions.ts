import { Action } from '@ngrx/store';


export enum AppActionTypes {
  IS_FETCHING = '[App] FETCH',
  SET_SURVEYS = '[App] SURVEYS',
}

export class IsFetching implements Action {
    readonly type = AppActionTypes.IS_FETCHING;
    constructor(public payload: boolean) { }
}

export class SetSurveys implements Action {
  readonly type = AppActionTypes.SET_SURVEYS;
  constructor(public payload: any) {}
}

export type All =
    | IsFetching
    | SetSurveys ;
