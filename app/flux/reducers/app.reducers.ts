import { AppActionTypes, All } from '../actions/app.actions';

export interface State {
    // is fetching a process?
    isFetching: boolean;
    surveys: any;
    act:any;
    eventTypes:Array<any>
    activitiesTypes:Array<any>
    activeEvents:Array<any>
    devolutionStates:Array<any>
}

export const initialState: State = {
    isFetching: false,
    surveys: {},
    act:{},
    eventTypes:[],
    activitiesTypes:[],
    activeEvents:[],
    devolutionStates:[]
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
    case AppActionTypes.SET_EVENT_TYPES: {

      state = {
        ...state,
        eventTypes: action.payload
      };
      
      return state;
    }
    case AppActionTypes.SET_REGISTER_TYPES: {

      state = {
        ...state,
        activitiesTypes: action.payload
      };
      
      return state;
    }
    case AppActionTypes.SET_ACTIVE_EVENTS: {

      state = {
        ...state,
        activeEvents: action.payload
      };
      
      return state;
    }
    case AppActionTypes.SET_DEVOLUTION_STATES: {

      state = {
        ...state,
        devolutionStates: action.payload
      };
      
      return state;
    }
    default: {
      return state;
    }
  }
}
