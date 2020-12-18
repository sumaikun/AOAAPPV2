import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { confirm } from "tns-core-modules/ui/dialogs";


import { CitasService } from "./services/citas.services";

//Store

import { Store } from '@ngrx/store';
import { AppState } from './flux/app.states';
import { LogOut } from './flux/actions/auth.actions';
import { SetInitialState } from './flux/actions/citas.actions';
import { properties } from "./properties";
import { startMonitoring, stopMonitoring }from "tns-core-modules/connectivity";
import * as connectivityModule from "tns-core-modules/connectivity";
import { Observable } from "rxjs/Observable";
import { selectApiloadsState } from './flux/app.states';

import { ImageSource, fromFile } from "tns-core-modules/image-source";

import { SetAppointmentPictures } from './flux/actions/apiloads.actions'

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit, OnDestroy {

  connectionType: string;

  getApiloadsState: Observable<any>;

  constructor(
      private router: RouterExtensions,
      private store: Store<AppState>,
      private citasService: CitasService
  ) {
      this.getApiloadsState = this.store.select(selectApiloadsState)
      console.log("App component constructor");
      const logoutAction = () => {
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

    this.getApiloadsState.subscribe( async(state) =>
		{
      //console.log("getApiloadsState",state)

      const {appointmentsPictures} = state

      const keys = Object.keys(appointmentsPictures)

      for(let i=0; i<keys.length; i++)
      {
        console.log("key",keys[i],appointmentsPictures[keys[i]])

        if(appointmentsPictures[keys[i]])
        {
          const { frontCameraImage, leftCameraImage, rightCameraImage, backCameraImage,
            odometerCameraImage, contractImage, checkCameraImage, inventoryCameraImage,
            mode,  pictureTimes, kilometersRegistered, deliveryKilometer, devolutionState  } = appointmentsPictures[keys[i]]
          
          const frontImageSrc: ImageSource = fromFile(frontCameraImage)
          //console.log("frontImageSrc",frontImageSrc.toBase64String("jpeg",65))
  
          const leftImageSrc: ImageSource = fromFile(leftCameraImage)
          //console.log("leftImageSrc",leftImageSrc.toBase64String("jpeg",65))
  
          const rightImageSrc: ImageSource = fromFile(rightCameraImage)
          //console.log("righttImageSrc",rightImageSrc.toBase64String("jpeg",65))
  
          const backImageSrc: ImageSource = fromFile(backCameraImage)
          //console.log("backImageSrc",backImageSrc.toBase64String("jpeg",65))
  
          const odometerImageSrc: ImageSource = fromFile(odometerCameraImage)
          //console.log("odometerImageSrc",odometerImageSrc.toBase64String("jpeg",65))
  
          const contractImageSrc: ImageSource = fromFile(contractImage)
          //console.log("contractImageSrc",contractImageSrc.toBase64String("jpeg",65))
  
          const checkImageSrc: ImageSource = fromFile(checkCameraImage)
          //console.log("checkImageSrc",checkImageSrc.toBase64String("jpeg",65))
  
          const inventoryImageSrc: ImageSource = fromFile(inventoryCameraImage)
          //console.log("inventoryImageSrc",inventoryImageSrc.toBase64String("jpeg",65))
          
          const type = mode === 1 ? "deliver" : "devolution"
  
          console.log("synchronized",appointmentsPictures[keys[i]].synchronized) 
          
  
          if( this.connectionType === "Wi-Fi" || this.connectionType === "Mobile" )
          {
            try{       
              const response = await this.citasService.saveAppointment({
                appointment:keys[i],
                type,
                frontImageSrc:frontImageSrc.toBase64String("jpeg",65),
                leftImageSrc:leftImageSrc.toBase64String("jpeg",65),
                rightImageSrc:rightImageSrc.toBase64String("jpeg",65),
                backImageSrc:backImageSrc.toBase64String("jpeg",65),
                odometerImageSrc:odometerImageSrc.toBase64String("jpeg",65),
                contractImageSrc:contractImageSrc.toBase64String("jpeg",65),
                checkImageSrc:checkImageSrc.toBase64String("jpeg",65),
                inventoryImageSrc:inventoryImageSrc.toBase64String("jpeg",65),
                pictureTimes,
                kilometersRegistered,
                deliveryKilometer,
                devolutionState
              }).toPromise()
    
              console.log("aoa images response",response)
    
              if(response["message"]  && response["message"] === "ok")
              {
                console.log("dont synchro anymore")
                /*this.store.dispatch( new SetAppointmentPictures({ appointment:keys[i],
                   data: { ...appointmentsPictures[keys[i]], synchronized:true } }) )*/
              }
    
            }catch(error){
              console.error("error",error)
            }
          }else{
            console.log("No internet")
          }     
        }

      }      
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
                this.store.dispatch( new SetAppointmentPictures({ appointment:"subscriberInitation",
                  data:  null, synchronized:true }))
                //this.ngOnInit();
                break;
            case connectivityModule.connectionType.mobile:
                this.connectionType = "Mobile";
                console.log("Connection type changed to mobile.");
                this.store.dispatch( new SetAppointmentPictures({ appointment:"subscriberInitation",
                  data:  null, synchronized:true }))
                //this.ngOnInit();
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

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}

//Citas de entrega,  Si es domicilio en la interfaz de seleccionar cita al seleccionar verificarlo y preguntarle kilometraje de salida de patio, kilometraje_inicial_servicio
//antes de las imagenes preguntar el kilometraje de llegada

//En devolución es al revez kilometraje de devolución , y el kilometraje de llegada a la oficina o arribo a patio