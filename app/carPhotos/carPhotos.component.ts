import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { takePicture, requestPermissions, isAvailable } from 'nativescript-camera';
//import { ImageAsset } from 'tns-core-modules/image-asset';
//import {ImageSource, fromFile, fromAsset, fromResource, fromBase64} from "tns-core-modules/image-source";
import { Image } from "tns-core-modules/ui/image";
import { RouterExtensions } from "nativescript-angular/router";
import {  ActivatedRoute, Params } from '@angular/router';

import { prompt, alert } from "tns-core-modules/ui/dialogs";


//flux
import { Observable } from 'rxjs/Observable';
import { AppState, selectCitasState } from '../flux/app.states';
import { Store } from '@ngrx/store';
import { IsFetching } from '../flux/actions/app.actions';

const options = {
    width: 500,
    height: 500,
    keepAspectRatio: true,
    saveToGallery: true
};

@Component({
	selector: "Carphotos",
	moduleId: module.id,
	templateUrl: "./carPhotos.component.html",
	styleUrls: ['./carPhotos.component.css']
})
export class CarphotosComponent implements OnInit {

	saveToGallery: boolean = true;


	frontCameraImage: Image;
	leftCameraImage: Image;
	rightCameraImage: Image;
	backCameraImage: Image;
	odometerCameraImage: Image;
	contractImage: Image;
	checkCameraImage: Image;
	inventoryCameraImage: Image;

	prevFrontImage: string;
	prevLeftImage: string;
	prevRightImage: string;
	prevBackImage: string;
	prevOdometerImage: string;


	urlPage: string = "https://app.aoacolombia.com/Control/operativo/";

	mode: number;
	showPictures: boolean = false;
	getAppointmentsState: Observable<any>;
	currentSiniester: any;
	isFetching: boolean = false;


	//

	kilometersRegistered: number;

	constructor(private page: Page, private router: RouterExtensions,
	private route: ActivatedRoute, private store: Store<AppState>) {
		this.getAppointmentsState = this.store.select(selectCitasState);
	}

	ngOnInit(): void {
		
		prompt({title:"¿Cual es el kilometraje actual?", defaultText:"",
		okButtonText: "CONTINUAR", inputType:"number"}).then(r => {
			console.log("Dialog result: " + r.result + ", text: " + r.text);
			if(r.result)
			{
				this.kilometersRegistered = Number(r.text)
			}	
			
		
		});
		 
		this.page.actionBarHidden = true;

		this.route.params.subscribe((params: Params) => {
			console.log(params);
			this.mode = params.mode;
		});

		this.getAppointmentsState.subscribe( (state) =>
		{

				if(this.mode == 2)
				{
					console.log(state.siniesterInfo);

					this.currentSiniester = state.DevolAppointments.filter( devol =>
								state.siniesterInfo.numero == devol.numero
					)[0];

					console.log("current siniester");
					//frontal
					console.log(this.currentSiniester.fotovh1_f);
					this.prevFrontImage = this.urlPage+this.currentSiniester.fotovh1_f;
					let filename = this.prevFrontImage.replace(/^.*[\\\/]/, '')
					this.prevFrontImage = this.prevFrontImage.replace(filename,"tumb_"+filename);
					console.log(this.prevFrontImage);
					//izquierda
					console.log(this.currentSiniester.fotovh2_f);
					this.prevLeftImage = this.urlPage+this.currentSiniester.fotovh2_f;
					filename = this.prevLeftImage.replace(/^.*[\\\/]/, '')
					this.prevLeftImage = this.prevLeftImage.replace(filename,"tumb_"+filename);
					//derecha
					console.log(this.currentSiniester.fotovh3_f);
					this.prevRightImage = this.urlPage+this.currentSiniester.fotovh3_f;
					filename = this.prevRightImage.replace(/^.*[\\\/]/, '')
					this.prevRightImage = this.prevRightImage.replace(filename,"tumb_"+filename);
					//detras
					console.log(this.currentSiniester.fotovh4_f);
					this.prevBackImage = this.urlPage+this.currentSiniester.fotovh4_f;
					filename = this.prevBackImage.replace(/^.*[\\\/]/, '')
					this.prevBackImage = this.prevBackImage.replace(filename,"tumb_"+filename);
					//odometro
					console.log(this.currentSiniester.img_odo_salida_f);
					this.prevOdometerImage = this.urlPage+this.currentSiniester.img_odo_salida_f;
					filename = this.prevOdometerImage.replace(/^.*[\\\/]/, '')
					this.prevOdometerImage = this.prevOdometerImage.replace(filename,"tumb_"+filename);
				}

		});

	}



    onTakePictureTap(args,imageIndex) {
        requestPermissions().then(
            () => this.capture(imageIndex),
            () => alert('permisos rechazados')
        );
    }

    capture(imageIndex) {
		if(!isAvailable())
        {
            alert({
                title: "error",
                message: "No se puede acceder a la camara",
                okButtonText: "Ok"
            });
        }else{
        takePicture(options)
            .then((imageAsset: any) => {
								console.log(imageAsset._android);

								this[imageIndex] = imageAsset._android;
								//this.frontCameraImage = imageAsset._android;
								console.log("try to add by reference");
								/*fromAsset(imageAsset).then(res => {
											console.log(res);
			                let base64 = res.toBase64String("jpeg", 100);
		            });*/

            }, (error) => {
                console.log("Error: " + error);
			});
		}
    }

	verifyThisImage(thisImage){
		console.log("here double tap");
		this.router.navigate(["/watchPic", thisImage]);
	}

	saveImages(){
		if(this.kilometersRegistered == null)
		{
			alert({
                title: "error",
                message: "Necesita poner el kilometraje antes de guardar las imagenes",
                okButtonText: "Ok"
            });
		}else{
			this.sendPics()	
		}
		console.log("validate save images")
	}

	registerKilometers(){

		const kilometers = this.kilometersRegistered ? this.kilometersRegistered.toString() : null

		prompt({title:"¿Cual es el kilometraje actual?", defaultText:kilometers,
		 inputType:"number",okButtonText: "CONTINUAR"}).then(r => {
			console.log("Dialog result: " + r.result + ", text: " + r.text);
			if(r.result)
			{
				this.kilometersRegistered = Number(r.text)
			}
		});
	}

	sendPics(){
		console.log("Enviar fotos");
	}

	serverPicLoaded(){

	}

	showPics(){
		this.showPictures = ! this.showPictures;
		console.log(this.showPictures);

		//this.isFetching = true;

		//let self = this;

		//setTimeout(function(){ self.isFetching = false; }, 3000);

	}

	makeSurvey(){
		this.router.navigateByUrl('/surveys/survey/1');
	}

	makeAct(){
		this.router.navigateByUrl('/surveys/act/1');
	}

}
