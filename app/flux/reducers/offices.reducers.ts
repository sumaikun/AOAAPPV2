import { OfficeActionTypes, All } from '../actions/office.actions';

export interface State {
    userOffices: any[]
}

export const initialState: State = {
    userOffices: []
};

export function reducer(state = initialState, action: All): State {
  //console.log("get into office reducer");
  switch (action.type) {
    case OfficeActionTypes.SET_OFFICES: {
    
      state = {
        ...state,
        userOffices: action.payload
      };

      return state;
    }
    default: {
      return state;
    }
  }
}
