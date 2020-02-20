import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { RouterExtensions } from "nativescript-angular/router";
import { CitasService } from "../../services/citas.services";
import {catchError} from 'rxjs/operators/catchError';
import { tap } from 'rxjs/operators';
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { serverResponse } from "../../helpers/serverResponse" 
import { properties } from '../../properties';
import {
  IsFetching
} from '../actions/app.actions';
import * as moment from 'moment';

import {
  GetCitasEntrega,
  GetCitasDevolucion,
  SetCitasEntrega,
  SetCitasDevolucion,
  GetCitasSiniestrosInfo,
  SetCitasSiniestrosInfo,
  CitasActionTypes,
  SetCitasEntregaR,
  SetCitasDevolucionR,
} from '../actions/citas.actions';

@Injectable()
export class CitasEffects {

    constructor(
        private actions$: Actions,
        private citasService: CitasService,
        private router: RouterExtensions,
    ){ }


  @Effect({ dispatch: true })
  getDelAppointments$ = this.actions$.pipe(
      ofType(CitasActionTypes.GET_CITAS_ENT),
      mergeMap((action:any) =>{
        //console.log("in Citas Effects");
        //console.log(action);
        return  this.citasService.getDeliverAppointments(action.payload.office,action.payload.date).pipe(
          mergeMap((data:any) =>
            {

              console.log("action payload",action.payload)

              let dispatchArray = [] ;

              if(data && data.appointments)
              {
                if(action.payload.keepFetching)
                {
                  dispatchArray = [new SetCitasEntregaR({data:data.appointments,date:action.payload.date,office:action.payload.office})];
                }            
                else
                {
                  dispatchArray = [new SetCitasEntregaR({data:data.appointments,date:action.payload.date,office:action.payload.office})
                    ,new IsFetching(false)];
                }
              }              
              
              return dispatchArray;
              
            }),
          catchError(error =>
          {
            console.log(error,error.stack)  
            serverResponse.checkServerError(error)
            return of( new IsFetching(false) );
          }));

      })
    );

  @Effect({ dispatch: true })
    getDevolAppointments$ = this.actions$.pipe(
      ofType(CitasActionTypes.GET_CITAS_DEV),
      mergeMap((action:any) =>{
        //console.log("in Citas Effects");
        //console.log(action);
        return  this.citasService.getDevolutionAppointments(action.payload.office,action.payload.date).pipe(
          switchMap((data:any) =>
            {
                //console.log("Citas de devolución");
                //console.log(data);

                let dispatchArray = [];

                if(data && data.appointments)
                {
                  if(action.payload.keepFetching)
                  {
                    dispatchArray = [new SetCitasDevolucionR({data:data.appointments,date:action.payload.date,office:action.payload.office})];
                  }               
                  else
                  {
                    dispatchArray = [new SetCitasDevolucionR({data:data.appointments,date:action.payload.date,office:action.payload.office}),new IsFetching(false)];
                  }
                }  

                return dispatchArray;
            }),
          catchError(error =>
          {
            console.log(error,error.stack)  
            serverResponse.checkServerError(error)
              return of( new IsFetching(false) );
          }));

      })
    );


  @Effect({ dispatch: true })
  getAppointmentSiniesterInfo$ = this.actions$.pipe(
      ofType(CitasActionTypes.GET_CITAS_SINI_INFO),
      mergeMap((action:any) =>{
        //console.log("in Citas Effects");
        //console.log(action);

        /*if(navigator.onLine)
        {
          let dispatchArray;
          dispatchArray = [new SetCitasSiniestrosInfo(null),new IsFetching(false)];
          return dispatchArray;
        } */       

        return  this.citasService.getAppointmentsSiniesterInfo(action.payload.idAppointment).pipe(
          switchMap((data:any) =>
            {
              //console.log("Obtener información del siniestro");
              //console.log(data);

              let dispatchArray;

              if(action.payload.keepFetching)
              {
                dispatchArray = [new SetCitasSiniestrosInfo(data.siniester)];
              }
              else
              {
                  dispatchArray = [new SetCitasSiniestrosInfo(data.siniester),new IsFetching(false)];
              }

              if(properties.getInstance().getCb())
              {
                let cb = properties.getInstance().getCb()
                cb(true,false)
              }

              return dispatchArray;
            }),
          catchError(error =>
          {
            console.log(error,error.stack)  
            
            serverResponse.checkServerError(error)            
            
            if(properties.getInstance().getCb())
            {              
              let cb = properties.getInstance().getCb()
              cb(false,true)
            }
 
            return of( new IsFetching(false) );
          }));

    })
  );

}
