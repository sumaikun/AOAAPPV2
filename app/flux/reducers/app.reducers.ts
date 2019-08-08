import { AppActionTypes, All } from '../actions/app.actions';

export interface State {
    // is fetching a process?
    isFetching: boolean;
}

export const initialState: State = {
    isFetching: false
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
    default: {
      return state;
    }
  }
}
