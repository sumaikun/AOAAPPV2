import { ApiloadActionTypes, All } from '../actions/apiloads.actions';

export interface State {
    appointmentsPictures:any
}

export const initialState: State = {
    appointmentsPictures:{}
};

export function reducer(state = initialState, action: All): State {
  //console.log("get into app reducer");
  switch (action.type) {
    case ApiloadActionTypes.SET_APPOINTMENT_PICTURES: {

      state = {
        ...state,
        appointmentsPictures: {  ...state.appointmentsPictures, [action.payload["appointment"]] : action.payload["data"]  } 
      };
      
      return state;
    }
    default: {
      return state;
    }
  }
}
