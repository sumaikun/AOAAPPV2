import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { RouterExtensions } from "nativescript-angular/router";
import { AuthService } from "../../services/auth.service";
import {catchError} from 'rxjs/operators/catchError';
import { tap } from 'rxjs/operators';
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { properties } from '../../properties';

import {
  AuthActionTypes,
  LogIn,
  LogInSuccess,
  LogInFailure
} from '../actions/auth.actions';

import {
  IsFetching,
  SetSurveys,
  SetAct,
  SetEventTypes,
  SetRegisterTypes
} from '../actions/app.actions';

import {
  SetOffices,  
} from '../actions/office.actions';

import {
  SetCitasEntrega,
  SetCitasDevolucion,
  SetCitasSiniestrosInfo
} from '../actions/citas.actions';


@Injectable()
export class AuthEffects {

    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private router: RouterExtensions,
    ) { }


   @Effect({ dispatch: true })
   login$ = this.actions$.pipe(
       ofType(AuthActionTypes.LOGIN),
       mergeMap((action:any) =>{
         return this.authService.logIn(action.payload.username,action.payload.password).pipe(
           mergeMap(data =>
             {
                let dispatchArray;

                if(data)
                {   

                  console.log("auth data",data)
                  //access token 
                  properties.setToken(data.user.token);

                  dispatchArray = [
                    new LogInSuccess(data.user),
                    new SetOffices(data.offices),
                    new SetCitasEntrega(data.deliverAppointments),
                    new SetCitasDevolucion(data.devolappointments),
                    new SetSurveys(data.surveys),
                    new SetAct(data.act),
                    new SetCitasSiniestrosInfo(data.deliverInfo),
                    new SetCitasSiniestrosInfo(data.devolInfo),
                    new SetEventTypes(data.eventTypes),
                    new SetRegisterTypes(data.activitiesTypes),
                    new IsFetching(false)                   
                  ];

                  

                }
                else{
                  //console.log("second condition");
                  dispatchArray = [new LogInSuccess(null) ,new IsFetching(false)];
                }

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
              return of(new IsFetching(false));
           })
         )

        })
      );


    @Effect({ dispatch: false })
    LogInSuccess = this.actions$.pipe(
      ofType(AuthActionTypes.LOGIN_SUCCESS),
      tap((data:any) => {
        if(!data.payload)
        {
          alert({
              title: "error",
              message: "No puede ingresar, verifique su usuario y contraseña",
              okButtonText: "Ok"
          });
        }
        else{
          this.router.navigateByUrl('/home');          
        }

      })
    );






}
