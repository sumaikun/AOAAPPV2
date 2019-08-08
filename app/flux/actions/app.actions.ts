import { Action } from '@ngrx/store';


export enum AppActionTypes {
  IS_FETCHING = '[App] FETCH',
}

export class IsFetching implements Action {
    readonly type = AppActionTypes.IS_FETCHING;
    constructor(public payload: boolean) { }
}

export type All =
    | IsFetching ;
