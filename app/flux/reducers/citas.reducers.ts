import { CitasActionTypes, All } from '../actions/citas.actions';
import * as moment from 'moment';

export interface State {
    DeliverAppointments: any[],
    DevolAppointments: any[],
    filteredOffice: string,
    filteredDate: string,
    siniesterInfo: any[];
}

export const initialState: State = {
    DeliverAppointments: [],
    DevolAppointments: [],
    filteredOffice: null,
    filteredDate: null,
    siniesterInfo: []
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

      /*try{

        let previousAppointments = state.DeliverAppointments

        action.payload.forEach( data =>{

          const index = previousAppointments.findIndex( appoint =>  appoint.id  === data.id )
          
          index != -1 ? previousAppointments[index] = data : previousAppointments.push(data)

        })

        state = {
          ...state,
          DeliverAppointments: previousAppointments
        };
      }catch(e){}*/
      
      state = {
        ...state,
        DeliverAppointments: action.payload
      };

      return state;
      
    }
    case CitasActionTypes.SET_CITAS_DEV: {

      /*try{
        let previousAppointments = state.DevolAppointments

        action.payload.forEach( data =>{

          const index = previousAppointments.findIndex( appoint =>  appoint.id  === data.id )
          
          index != -1 ? previousAppointments[index] = data : previousAppointments.push(data)

        })

        
      }catch(e){} */
      
      state = {
        ...state,
        DevolAppointments: action.payload
      };

      return state;

    }
    case CitasActionTypes.SET_CITAS_SINI_INFO: {

      //console.log("on reducer check what happened")
      let previousSiniesters = state.siniesterInfo ? state.siniesterInfo : []

      try{       

        action.payload.forEach( data =>{

          //console.log(data)

          const index = previousSiniesters.findIndex( siniester =>  siniester.citaid  === data.citaid )
          
          index != -1 ? previousSiniesters[index] = data : previousSiniesters.push(data)

        })
      }catch(e){}  

        state = {
          ...state,
          siniesterInfo: previousSiniesters
        };
      
     
      return state;
    }

    case CitasActionTypes.SET_CITAS_ENT_R:{

        let prevDeliv = state.DeliverAppointments

        let filteredCitasEnt =  prevDeliv.filter( appointment => 
          moment(appointment.fecha).format("YYYY-MM-DD") === moment(action.payload.date).format("YYYY-MM-DD")
          && appointment.oficina === Number(action.payload.office)          
        )

        console.log("filtered Data",filteredCitasEnt)

        filteredCitasEnt.forEach( data =>{
          const index = prevDeliv.findIndex( deliver => deliver.citaid === data.citaid )
          //console.log(index)
          prevDeliv.splice(index,1)
        })

        action.payload.data.forEach( data => prevDeliv.push(data) )

        state = {
          ...state,
          DeliverAppointments: prevDeliv
        };

        return state;
    }

    case CitasActionTypes.SET_CITAS_DEV_R:{

        console.log(action.payload)

        let prevDevol = state.DevolAppointments

        let filteredCitasDev =  prevDevol.filter( appointment => 
          moment(appointment.fec_devolucion).format("YYYY-MM-DD") === moment(action.payload.date).format("YYYY-MM-DD")
          && appointment.oficina === Number(action.payload.office)
        )

        console.log("filtered Data Dev",filteredCitasDev)

        filteredCitasDev.forEach( data =>{
          const index = prevDevol.findIndex( deliver => deliver.citaid === data.citaid )
          prevDevol.splice(index,1)
        })

        action.payload.data.forEach( data => prevDevol.push(data) )

        state = {
          ...state,
          DevolAppointments: prevDevol
        };

        return state;    
    }

    case CitasActionTypes.SET_INITIAL_STATE:{
        state = initialState
        return state
    }

    default: {
      return state;
    }
  }
}
