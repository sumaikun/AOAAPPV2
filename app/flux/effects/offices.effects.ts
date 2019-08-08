import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { RouterExtensions } from "nativescript-angular/router";
import { OfficeService } from "../../services/office.services";
import {catchError} from 'rxjs/operators/catchError';
import { tap } from 'rxjs/operators';
import { alert, prompt } from "tns-core-modules/ui/dialogs";


import {
  IsFetching
} from '../actions/app.actions';

import {
  SetOffices,
  GetOffices,
  OfficeActionTypes
} from '../actions/office.actions';

@Injectable()
export class OfficeEffects {

    constructor(
        private actions$: Actions,
        private officeService: OfficeService,
        private router: RouterExtensions,
    ){ }


   @Effect({ dispatch: true })
   setOffices$ = this.actions$.pipe(
       ofType(OfficeActionTypes.GET_OFFICES),
       mergeMap((action:any) =>{
         console.log("in Office Effects");
         return this.officeService.getOffices().pipe(
           switchMap(data =>
             {
                console.log("Effect for offices");
                //console.log(data);
                let dispatchArray;
                if(action.payload.keepFetching)
                {
                    dispatchArray = [new SetOffices(data)];
                }
                else{
                    dispatchArray = [new SetOffices(data),new IsFetching(false)];
                }

                return dispatchArray;
             }),
           catchError(error =>
           {
             console.log(error);
             alert({
                 title: "error",
                 message: "Hubo error en el servidor obteniendo información de las oficinas",
                 okButtonText: "Ok"
             });
              return of( new IsFetching(false) );
           })
         )

        })
      );

}
