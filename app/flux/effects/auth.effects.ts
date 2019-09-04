import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { RouterExtensions } from "nativescript-angular/router";
import { AuthService } from "../../services/auth.service";
import {catchError} from 'rxjs/operators/catchError';
import { tap } from 'rxjs/operators';
import { alert, prompt } from "tns-core-modules/ui/dialogs";

import {
  AuthActionTypes,
  LogIn,
  LogInSuccess,
  LogInFailure
} from '../actions/auth.actions';

import {
  IsFetching
} from '../actions/app.actions';

import {
  SetOffices,
  GetOffices
} from '../actions/office.actions';

import {
  GetCitasEntrega,
  GetCitasDevolucion
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
                  //console.log("first condition");
                  //console.log(data);

                  if(data.datosFlota === null)
                  {
                      alert({
                          title: "error",
                          message: "El usuario administrador necesita un operario de flota",
                          okButtonText: "Ok"
                      });

                      return dispatchArray = [new IsFetching(false)];
                  }

                  let todayDate = new Date().getFullYear() + "-"
                	+ ( new Date().getMonth() + 1 > 9 ?  new Date().getMonth() + 1 : "0"+ ( new Date().getMonth() + 1 ) )
                	+ "-" +  ( new Date().getDate()  > 9 ?  new Date().getDate() : "0"+ ( new Date().getDate()  ) ) ;

                  dispatchArray = [
                    new LogInSuccess(data),
                    new GetOffices(data),
                    new GetCitasEntrega({office:data.datosFlota.oficina,date:todayDate,keepFetching:true}),
                    new GetCitasDevolucion({office:data.datosFlota.oficina,date:todayDate,keepFetching:true})
                  ];
                }
                else{
                  //console.log("second condition");
                  dispatchArray = [new LogInSuccess(data) ,new IsFetching(false)];
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
              return of( new LogInFailure(error));
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
