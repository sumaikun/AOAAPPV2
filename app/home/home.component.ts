import { Component, OnInit, ViewContainerRef } from "@angular/core";
//import { RadSideDrawer } from "nativescript-ui-sidedrawer";
//import * as app from "tns-core-modules/application";
import { Page } from "tns-core-modules/ui/page";
import { alert } from "tns-core-modules/ui/dialogs";

//import { properties } from '../properties';

//flux
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState, selectAppState, selectAuthState   } from '../flux/app.states';
import { SetUserData } from '../flux/actions/auth.actions'

//camera
import * as camera from "nativescript-camera";

//modals
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ActivitiesRegistermodalComponent } from "../modals/activitiesRegister.component";

//geolocation
import * as Geolocation from "nativescript-geolocation";


import * as application from "tns-core-modules/application";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "tns-core-modules/application";

//Router
import { RouterExtensions } from "nativescript-angular/router";

import { IsFetching, GetActiveEvents } from '../flux/actions/app.actions';


const options = {
    width: 500,
    height: 500,
    keepAspectRatio: true,
    saveToGallery: true
};

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {

    getState: Observable<any>;
    getAuthState: Observable<any>;
    isFetching: boolean | null;
    getActivitiesFlag:boolean = false
    selfiePath: string;
    userData: any

    options: ModalDialogOptions = {
        viewContainerRef: this.viewContainerRef,
        fullscreen: false,
        context: {}
    };

    eventTypes: Array<any>
    registerTypes: Array<any>
    activeEvents: Array<any>    

    currentLongitude: number;
    currentLatitude: number;

    //Experimental list picker

    //public showingListPicker: boolean = false;
    //public items: Array<any>


    constructor(private page: Page,
        private store: Store<AppState>,
        private viewContainerRef: ViewContainerRef,
        private modalService: ModalDialogService,
        private router: RouterExtensions) {
      this.getState = this.store.select(selectAppState);
      this.getAuthState = this.store.select(selectAuthState);
            
      
      /*this.items = [
        { id: 1, name: "Ter Stegen", role: "Goalkeeper" },
        { id: 3, name: "Piqué", role: "Defender" },
        { id: 4, name: "I. Rakitic", role: "Midfielder" },
        { id: 5, name: "Sergio", role: "Midfielder" },
      ];*/  


    }

    ngOnInit(): void {

        this.page.actionBarHidden = true;

        this.getState.subscribe( (state) =>
        {
            //console.log("appState",state)
            //console.log("getActivitiesFlag",this.getActivitiesFlag)
            //console.log("state.activeEvents",state.activeEvents)


            this.isFetching = state.isFetching;
            this.eventTypes = state.eventTypes;
            this.registerTypes = state.activitiesTypes;
            this.activeEvents = state.activeEvents

            if(state.activeEvents.length > 0 && this.getActivitiesFlag === true )
            {
                this.getActivitiesFlag = false
                this.router.navigateByUrl('/listPicker/pendingEvents/'+JSON.stringify(state.activeEvents)); 
            }

            if(state.activeEvents.length == 0 && this.getActivitiesFlag === true )
            {
                this.getActivitiesFlag = false
                alert({
                    title: "Espera",
                    message: "No tiene actualmente eventos activos",
                    okButtonText: "Ok"
                });
            }
        
        });

        this.getAuthState.subscribe( (state) =>
        {
            //console.log("auth state",state)

            this.userData = state.userData

            if(state.userData.userImg)
            {
                this.selfiePath = state.userData.userImg ? state.userData.userImg : null 
            }
        });

        this.currentLatitude = 0
        this.currentLongitude = 0

        Geolocation.enableLocationRequest(true).then(() => {
            Geolocation.isEnabled().then(isLocationEnabled => {
                if(!isLocationEnabled) {
                    // potentially do more then just end here...
                    return;
                }

                // MUST pass empty object!!
                Geolocation.getCurrentLocation({})
                .then(result => {
                    console.log("location result",result)

                    this.currentLongitude = result.longitude
                    this.currentLatitude = result.latitude
                })
                .catch(e => {
                    console.log('loc error', e);
                });
            });
        });
        
        /*application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
            if (this.showingListPicker) {
              this.showingListPicker = false
              return;
            }
        });*/


    }

    takeSelfie(): void{
        
        console.log("take selfie")

        camera.requestPermissions().then(
            () => this.capture(),
            () => alert('permisos rechazados')
        );        
        
    }

    capture(): void{
        if(!camera.isAvailable())
        {
            alert({
                title: "error",
                message: "No se puede acceder a la camara",
                okButtonText: "Ok"
            });
        }else{
            console.log("time to take picture")
            camera.takePicture(options)
            .then((imageAsset) => {
                console.log(imageAsset)
                console.log("image path",imageAsset["_android"])
                console.log("Size: " + imageAsset.options.width + "x" + imageAsset.options.height);
                console.log("keepAspectRatio: " + imageAsset.options.keepAspectRatio);
                console.log("Photo saved in Photos/Gallery for Android or in Camera Roll for iOS");

                //this.selfiePath = imageAsset["_android"]
                this.userData.userImg = imageAsset["_android"]
                this.store.dispatch( new SetUserData(this.userData) )

            }).catch((err) => {
                console.log("trying to get error",err)
                console.log("Error -> " + err.message);
            });
        }
    }

    registerActivity(): void{
        
        console.log("ok lest register activity")

        this.options.context = { eventTypes:this.eventTypes, activitiesTypes:this.registerTypes, 
            longitude: this.currentLongitude, latitude: this.currentLatitude, id:this.userData.id }

        //this.options.context.activitiesTypes = this.registerTypes

        this.modalService.showModal(ActivitiesRegistermodalComponent, this.options).then((result: any) => {

        })
    }

    seeActiveEvents(): void{
        console.log("ok lets see activities")
        //this.showingListPicker = true
        //this.router.navigateByUrl('/listPicker/'+JSON.stringify(this.items)); 
        this.store.dispatch(new IsFetching(true));
        this.store.dispatch(new GetActiveEvents({id:this.userData.id}));

        this.getActivitiesFlag = true
    
    }

}
