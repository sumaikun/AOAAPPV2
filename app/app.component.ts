import { Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { confirm } from "tns-core-modules/ui/dialogs";


//Store

import { Store } from '@ngrx/store';
import { AppState } from './flux/app.states';
import { LogOut } from './flux/actions/auth.actions';
import { SetInitialState } from './flux/actions/citas.actions';
import { properties } from "./properties";

import { alert } from "tns-core-modules/ui/dialogs";


import { setInterval, clearInterval } from "tns-core-modules/timer";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent {

  constructor(
      private router: RouterExtensions,
      private store: Store<AppState>
  ) {
      console.log("App component constructor");
      const logoutAction = () => {
        console.log("logout Action")
        this.store.dispatch( new LogOut() )
        this.store.dispatch( new SetInitialState() )
        this.router.navigateByUrl('/login')
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
        localStorage.clear()
      }
      properties.setLogoutAction(logoutAction)   
      
      //Test info

      /*const id = setInterval(() => {
        alert({
          title: "look",
          message: properties.getInstance().getAppUrl(),
          okButtonText: "Ok"
        });
        clearInterval(id);
      }, 1000);*/

      


   }

  goTo(url): void {
    console.log("Go to citas");
    this.router.navigateByUrl(url);
    const sideDrawer = <RadSideDrawer>app.getRootView();
		sideDrawer.closeDrawer();
  }

  signOut(): void{
    let self = this;
    console.log("Cerrar sesión");
    confirm({ title:"",
      message:"¿ Desea cerrar la sesión ? ",
      okButtonText: "Si",
      cancelButtonText: "No"}).then(function (result) {

        if(result)
        {
          const action = properties.getInstance().getLogoutAction();
          action()
        } 

    });

  }

}
