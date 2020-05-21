import { Action } from '@ngrx/store';


export enum AppActionTypes {
  IS_FETCHING = '[App] FETCH',
  SET_SURVEYS = '[App] SURVEYS',
  SET_ACT = '[App] ACT',
  SET_EVENT_TYPES = '[App] EVENT_TYPES',
  SET_REGISTER_TYPES = '[App] REGISTER_TYPES',
  SET_ACTIVE_EVENTS = '[App] ACTIVE_EVENTS',
  GET_ACTIVE_EVENTS = '[App] GET_ACTIVE_EVENTS',
  CREATE_EVENT = '[App] CREATE_EVENT'
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

export class SetEventTypes implements Action {
  readonly type = AppActionTypes.SET_EVENT_TYPES;
  constructor(public payload: any) {}
}

export class SetRegisterTypes implements Action {
  readonly type = AppActionTypes.SET_REGISTER_TYPES;
  constructor(public payload: any) {}
}

export class CreateEvent implements Action {
  readonly type = AppActionTypes.CREATE_EVENT;
  constructor(public payload: any) { }
}

export class GetActiveEvents implements Action {
  readonly type = AppActionTypes.GET_ACTIVE_EVENTS;
  constructor(public payload: any) { }
}

export class SetActiveEvents implements Action {
  readonly type = AppActionTypes.SET_ACTIVE_EVENTS;
  constructor(public payload: any[]) { }
}

export type All =
    | IsFetching
    | SetSurveys 
    | SetAct
    | SetEventTypes
    | SetRegisterTypes
    | CreateEvent
    | SetActiveEvents;
