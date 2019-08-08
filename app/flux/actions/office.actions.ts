import { Action } from '@ngrx/store';


export enum OfficeActionTypes {
    GET_OFFICES = '[OFFICE] get',
    SET_OFFICES = '[OFFICE] set',
}

export class SetOffices implements Action {
  readonly type = OfficeActionTypes.SET_OFFICES;
  constructor(public payload: any[]) {}
}

export class GetOffices implements Action {
  readonly type = OfficeActionTypes.GET_OFFICES;
  constructor(public payload: any) {}
}

export type All =
    | SetOffices
    | GetOffices;
