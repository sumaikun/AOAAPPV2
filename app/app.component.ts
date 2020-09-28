import { Component, OnDestroy, OnInit } from "@angular/core";
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
import { connectionType, getConnectionType, startMonitoring, stopMonitoring }from "tns-core-modules/connectivity";
import * as connectivityModule from "tns-core-modules/connectivity";
import { Observable } from "rxjs/Observable";
import { selectApiloadsState } from './flux/app.states';

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit, OnDestroy {

  connectionType: string;

  getApiloadsState: Observable<any>;

  constructor(
      private router: RouterExtensions,
      private store: Store<AppState>
  ) {
      this.getApiloadsState = this.store.select(selectApiloadsState)
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
   }

   ngOnInit() {

    this.getApiloadsState.subscribe( (state) =>
		{
      console.log("getApiloadsState",state)
    })


    startMonitoring((type) => {
        switch (type) {
            case connectivityModule.connectionType.none:
                this.connectionType = "None";
                console.log("Connection type changed to none.");
                break;
            case connectivityModule.connectionType.wifi:
                this.connectionType = "Wi-Fi";
                console.log("Connection type changed to WiFi.");
                break;
            case connectivityModule.connectionType.mobile:
                this.connectionType = "Mobile";
                console.log("Connection type changed to mobile.");
                break;
            case connectivityModule.connectionType.bluetooth:
                this.connectionType = "Bluetooth";
                console.log("Connection type changed to Bluetooth.");
                break;
            default:
                break;
        }
    });
  }

  ngOnDestroy() {
      // Stoping the connection monitoring
      stopMonitoring();
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
