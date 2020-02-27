import { Component, OnInit } from "@angular/core";
//import { RadSideDrawer } from "nativescript-ui-sidedrawer";
//import * as app from "tns-core-modules/application";
import { Page } from "tns-core-modules/ui/page";
import { alert } from "tns-core-modules/ui/dialogs";

//import { properties } from '../properties';

//flux
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState, selectAppState, selectAuthState  } from '../flux/app.states';
import { SetUserData } from '../flux/actions/auth.actions'

//camera
import * as camera from "nativescript-camera";

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
    selfiePath: string;

    userData: any

    constructor(private page: Page, private store: Store<AppState>) {
      this.getState = this.store.select(selectAppState);
      this.getAuthState = this.store.select(selectAuthState);
    }

    ngOnInit(): void {

        this.page.actionBarHidden = true;

        this.getState.subscribe( (state) =>
        {
            this.isFetching = state.isFetching;
        });

        this.getAuthState.subscribe( (state) =>
        {
            this.userData = state.userData

            if(state.userData.userImg)
            {
                this.selfiePath = state.userData.userImg
            }
        });

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
                console.log("Error -> " + err.message);
            });
        }
    }


}
