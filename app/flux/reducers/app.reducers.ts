import { AppActionTypes, All } from '../actions/app.actions';

export interface State {
    // is fetching a process?
    isFetching: boolean;
    surveys: any;
}

export const initialState: State = {
    isFetching: false,
    surveys: {}
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
    default: {
      return state;
    }
  }
}
