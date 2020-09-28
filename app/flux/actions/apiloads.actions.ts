import { Action } from '@ngrx/store';


export enum ApiloadActionTypes {
  SET_APPOINTMENT_PICTURES = '[Apiloads] SET_APPOINTMENT_PICTURES',
}

export class SetAppointmentPictures implements Action {
  readonly type = ApiloadActionTypes.SET_APPOINTMENT_PICTURES;
  constructor(public payload: any) { }
}

export type All =
    | SetAppointmentPictures;
