import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { RouterExtensions } from "nativescript-angular/router";
import { CitasService } from "../../services/citas.services";
import {catchError} from 'rxjs/operators/catchError';
import { tap } from 'rxjs/operators';
import { alert, prompt } from "tns-core-modules/ui/dialogs";


import {
  IsFetching
} from '../actions/app.actions';

import {
  GetCitasEntrega,
  GetCitasDevolucion,
  SetCitasEntrega,
  SetCitasDevolucion,
  GetCitasSiniestrosInfo,
  SetCitasSiniestrosInfo,
  CitasActionTypes
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
           mergeMap(data =>
             {
                let dispatchArray;

                if(action.payload.keepFetching)
                {
                    dispatchArray = [new SetCitasEntrega(data)];
                }
                else{

                    dispatchArray = [new SetCitasEntrega(data),new IsFetching(false)];
                }

                return dispatchArray;
             }),
           catchError(error =>
           {
             console.log(error);
             alert({
                 title: "error",
                 message: "Hubo un error buscando las citas de entrega, verifique el servidor o la conexión a internet",
                 okButtonText: "Ok"
             });
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
              switchMap(data =>
                {
                   //console.log("Citas de devolución");
                   //console.log(data);

                   let dispatchArray;

                   if(action.payload.keepFetching)
                   {
                     dispatchArray = [new SetCitasDevolucion(data)];
                   }
                   else
                   {
                      dispatchArray = [new SetCitasDevolucion(data),new IsFetching(false)];
                   }

                   return dispatchArray;
                }),
              catchError(error =>
              {
                console.log(error);
                alert({
                    title: "error",
                    message: "Hubo un error buscando las citas de devolución, verifique el servidor o la conexión a internet",
                    okButtonText: "Ok"
                });
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
               return  this.citasService.getAppointmentsSiniesterInfo(action.payload.idAppointment).pipe(
                 switchMap(data =>
                   {
                      //console.log("Obtener información del siniestro");
                      //console.log(data);

                      let dispatchArray;

                      if(action.payload.keepFetching)
                      {
                        dispatchArray = [new SetCitasSiniestrosInfo(data)];
                      }
                      else
                      {
                         dispatchArray = [new SetCitasSiniestrosInfo(data),new IsFetching(false)];
                      }

                      return dispatchArray;
                   }),
                 catchError(error =>
                 {
                   console.log(error);
                   alert({
                       title: "error",
                       message: "Hubo un error buscando la, verifique el servidor o la conexión a internet",
                       okButtonText: "Ok"
                   });
                    return of( new IsFetching(false) );
                 }));

              })
            );

}
