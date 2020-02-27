import { AppActionTypes, All } from '../actions/app.actions';

export interface State {
    // is fetching a process?
    isFetching: boolean;
    surveys: any;
    act:any;
}

export const initialState: State = {
    isFetching: false,
    surveys: {},
    act:{}
};

export function reducer(state = initialState, action: All): State {
  //console.log("get into app reducer");
  switch (action.type) {
    case AppActionTypes.IS_FETCHING: {
      //console.log("get into is fetching");
      return {
        ...state,
        isFetching: action.payload
      };
    }
    case AppActionTypes.SET_SURVEYS: {

      state = {
        ...state,
        surveys: action.payload
      };

      console.log("surveys payload");

      console.log(action);

      return state;
    }
    case AppActionTypes.SET_ACT: {

      state = {
        ...state,
        act: action.payload
      };
      
      return state;
    }
    default: {
      return state;
    }
  }
}
