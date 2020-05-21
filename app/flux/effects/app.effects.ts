import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { RouterExtensions } from "nativescript-angular/router";
import { AppService } from "../../services/app.services";
import {catchError} from 'rxjs/operators/catchError';
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { serverResponse } from "../../helpers/serverResponse" 

import {
  IsFetching,
  CreateEvent,
  AppActionTypes,
  GetActiveEvents,
  SetActiveEvents
} from '../actions/app.actions';


@Injectable()
export class AppEffects {

    constructor(
        private actions$: Actions,
        private appService: AppService,
        private router: RouterExtensions,
    ) { }


   @Effect({ dispatch: true })
   createEvent$ = this.actions$.pipe(
       ofType(AppActionTypes.CREATE_EVENT),
       mergeMap((action:any) =>{
         return this.appService.createEvent(action.payload).pipe(
           mergeMap(data =>
             {
                let dispatchArray;

                if(data)
                {
                  console.log("app data",data)
                
                  dispatchArray = [
                    new IsFetching(false)                   
                  ];

                }
              
                alert({
                  title: "bien",
                  message: "Actividad registrada",
                  okButtonText: "Ok"
                });

               return dispatchArray;

             }),
           catchError(error =>
           {
             console.log("Error de servidor");
             console.log(error);
             alert({
                 title: "error",
                 message: "Hubo error en el servidor o no hay conexión a internet",
                 okButtonText: "Ok"
             });
              //return of( new LogInFailure(error));
              serverResponse.checkServerError(error)
              return of(new IsFetching(false));
           })
         )

        })
      );

      @Effect({ dispatch: true })
      getPendingEvents$ = this.actions$.pipe(
        ofType(AppActionTypes.GET_ACTIVE_EVENTS),
        mergeMap((action:any) =>{
          return this.appService.getActiveEvents(action.payload.id).pipe(
            mergeMap(data =>
              {
                  let dispatchArray;
  
                  if(data)
                  {
                    //console.log("get pending events",data["pendingEvents"])
                  
                    dispatchArray = [
                      new SetActiveEvents(data["pendingEvents"] || []),
                      new IsFetching(false)                   
                    ];
  
                  }
                  
                  console.log("i got here")
  
                  return dispatchArray;
  
              }),
            catchError(error =>
            {
              console.log("Error de servidor");
              console.log(error);
              alert({
                  title: "error",
                  message: "Hubo error en el servidor o no hay conexión a internet",
                  okButtonText: "Ok"
              });
                //return of( new LogInFailure(error));
                serverResponse.checkServerError(error)
                return of(new IsFetching(false));
            })
          )
  
      })
    );


}
