import { CitasActionTypes, All } from '../actions/citas.actions';

export interface State {
    DeliverAppointments: any[],
    DevolAppointments: any[],
    filteredOffice: string,
    filteredDate: string,
    siniesterInfo: any;
}

export const initialState: State = {
    DeliverAppointments: [],
    DevolAppointments: [],
    filteredOffice: null,
    filteredDate: null,
    siniesterInfo: null
};

export function reducer(state = initialState, action: All): State {

  switch (action.type) {
    case CitasActionTypes.GET_CITAS_ENT: {

      state = {
        ...state,
        filteredOffice: action.payload.office,
        filteredDate: action.payload.date
      };

      //console.log("citas entrega");
      //console.log(state);

      return state;
    }
    case CitasActionTypes.GET_CITAS_DEV: {

      state = {
        ...state,
        filteredOffice: action.payload.office,
        filteredDate: action.payload.date
      };

      //console.log("citas entrega");
      //console.log(state);

      return state;
    }
    case CitasActionTypes.SET_CITAS_ENT: {

      state = {
        ...state,
        DeliverAppointments: action.payload
      };

      //console.log("citas entrega");
      //console.log(state);

      return state;
    }
    case CitasActionTypes.SET_CITAS_DEV: {

      state = {
        ...state,
        DevolAppointments: action.payload
      };

      //console.log("citas de devolución");
      //console.log(state);

      return state;
    }
    case CitasActionTypes.SET_CITAS_SINI_INFO: {

      state = {
        ...state,
        siniesterInfo: action.payload
      };

      //console.log("citas de devolución");
      //console.log(state);

      return state;
    }
    default: {
      return state;
    }
  }
}
