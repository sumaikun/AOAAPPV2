import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { takePicture, requestPermissions, isAvailable } from 'nativescript-camera';
import { Image } from "tns-core-modules/ui/image";
import { RouterExtensions } from "nativescript-angular/router";
import {  ActivatedRoute, Params } from '@angular/router';
import { prompt, alert } from "tns-core-modules/ui/dialogs";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { StatesDevolutionModalComponent } from "../modals/statesDevolutionModal.component";
//flux
import { Observable } from 'rxjs/Observable';
import { AppState, selectCitasState } from '../flux/app.states';
import { Store } from '@ngrx/store';
import * as moment from "moment"
import { SetAppointmentPictures } from '../flux/actions/apiloads.actions'
import {  IsFetching } from '../flux/actions/app.actions'
import { selectApiloadsState,  selectAuthState } from '../flux/app.states';

import { connectionType, getConnectionType }from "tns-core-modules/connectivity";
import { fromAsset, ImageSource, fromFile } from "tns-core-modules/image-source";
import { CitasService } from "../services/citas.services";

const options = {
    width: 300,
    height: 300,
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
	aditional1Image: Image;
	aditional2Image: Image;

	prevFrontImage: string;
	prevLeftImage: string;
	prevRightImage: string;
	prevBackImage: string;
	prevOdometerImage: string;

	pictureTimes: any;


	urlPage: string = "https://app.aoacolombia.com/Control/operativo/";

	mode: number;
	appointment:string
	isDelivery:boolean
	showPictures: boolean = false;
	getAppointmentsState: Observable<any>;
	currentSiniester: any;
	isFetching: boolean = false;


	//

	kilometersRegistered: number;
	deliveryKilometer:number;
	kilometerLimit:number;
	proccess:string;


	currentAppointmentData: any
	getApiloadsState: Observable<any>;
	devolutionState: string

	getAuthState: Observable<any>;

	options: ModalDialogOptions = {
		viewContainerRef: this.viewContainerRef,
		fullscreen: false,
		context: {}
	};

	userN: string;

	userId: any;

	synchronized: boolean;

	constructor(private page: Page, private router: RouterExtensions,
		private modalService: ModalDialogService,
		private citasService: CitasService,
		private viewContainerRef: ViewContainerRef,
		private route: ActivatedRoute, private store: Store<AppState>) {
		this.getAppointmentsState = this.store.select(selectCitasState);
		this.getApiloadsState = this.store.select(selectApiloadsState);
		this.getAuthState = this.store.select(selectAuthState);
	}

	ngOnInit(): void {		
		
		this.isFetching = false

		this.pictureTimes = {}

		this.page.actionBarHidden = true;

		this.route.params.subscribe((params: Params) => {
			//console.log("params",params);
			this.mode = params.mode;
			this.appointment = params.appointment
			this.isDelivery = params.isDelivery === "true"

			console.log( typeof  this.isDelivery )

		});

		this.getAuthState.subscribe( (state) =>
		{
				//console.log("authState",state)		

				this.userN = state.userData.name
				
				this.userId = state.userData.id
				
		});

		this.getApiloadsState.subscribe( (state) =>
		{
			console.log("getApiloadsState",state)
			if(state.appointmentsPictures[this.appointment])
			{
				//console.log("api load got it",state.appointmentsPictures[this.appointment].frontCameraImage)
				
				this.frontCameraImage = state.appointmentsPictures[this.appointment].frontCameraImage
				this.leftCameraImage = state.appointmentsPictures[this.appointment].leftCameraImage
				this.rightCameraImage = state.appointmentsPictures[this.appointment].rightCameraImage
				this.backCameraImage = state.appointmentsPictures[this.appointment].backCameraImage
				this.odometerCameraImage = state.appointmentsPictures[this.appointment].odometerCameraImage
				this.contractImage = state.appointmentsPictures[this.appointment].contractImage
				this.checkCameraImage = state.appointmentsPictures[this.appointment].checkCameraImage 
				this.inventoryCameraImage = state.appointmentsPictures[this.appointment].inventoryCameraImage
				this.aditional1Image = state.appointmentsPictures[this.appointment].aditional1Image
				this.aditional2Image = state.appointmentsPictures[this.appointment].aditional2Image

				this.pictureTimes = state.appointmentsPictures[this.appointment].pictureTimes || {}
				this.kilometersRegistered = state.appointmentsPictures[this.appointment].kilometersRegistered
				this.deliveryKilometer = state.appointmentsPictures[this.appointment].deliveryKilometer

				this.kilometerLimit = state.appointmentsPictures[this.appointment].kilometerLimit || 0
				this.proccess = state.appointmentsPictures[this.appointment].proccess

				this.synchronized = state.appointmentsPictures[this.appointment].synchronized
			}
		})

		this.getAppointmentsState.subscribe( (state) =>
		{

			//console.log("full state",state)

				if(this.mode == 2)
				{
					//console.log("state.siniesterInfo",state.siniesterInfo );

					/*const siniesterNumberResult = state.siniesterInfo.filter( info => info.citaid.toString() === this.appointment.toString()  )

					const siniesterNumber = siniesterNumberResult[0].numero

					console.log("siniesterNumber",siniesterNumber)

					this.currentSiniester = state.DevolAppointments.filter( devol =>{
						console.log("devol",devol)
						return  devol.numero === siniesterNumber
					})[0];*/

					

					this.currentSiniester = state.DevolAppointments.filter( devol =>{
						return  devol.citaid.toString() === this.appointment
					})[0]

					console.log("current siniester",this.currentSiniester);

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

		const kilometers = this.kilometersRegistered ? this.kilometersRegistered.toString() : this.kilometerLimit.toString()


		if(!this.isDelivery  && this.proccess === "assign")
		{
			prompt({title:"¿Cual es el kilometraje actual?", defaultText:kilometers,
			okButtonText: "CONTINUAR", inputType:"number"}).then(r => {
				console.log("Dialog result: " + r.result + ", text: " + r.text);
				if(r.result)
				{
					if(r.text.length > 0)
					{
						console.log("r.text",r.text)
						this.kilometersRegistered = Number(r.text)
					}
					else{
						alert({
							title: "espera",
							message: "Debes poner un kilometraje valido",
							okButtonText: "Ok"
						});
					}					
				}				
			
			});
		}
		

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
            .then(async (imageAsset: any) => {

				const res = await fromAsset(imageAsset)
									
				console.log("fromAsset",res.height,res.width);

				if( res.width < res.height )
				{
					alert({
						title: "espera",
						message: "Solo toma las imagenes de forma lateral",
						okButtonText: "Ok"
					});
				}
				else{
					console.log(imageAsset._android,moment().format("YYYY-MM-DD HH:mm:ss"));

					//const dimensions = sizeOf.default(imageAsset._android)

					console.log("dimensions",imageAsset,imageIndex)

					this.pictureTimes[imageIndex] = moment().format("YYYY-MM-DD HH:mm:ss")
					this[imageIndex] = imageAsset._android;

					console.log("this[imageIndex]",this.frontCameraImage.height)

					//this.frontCameraImage = imageAsset._android;
					console.log("try to add by reference");
				}				
								
							
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
                message:  !this.isDelivery && "Necesita poner el kilometraje antes de guardar las imagenes" || this.isDelivery && "Necesita poner el kilometraje final antes de guardar las imagenes",
                okButtonText: "Ok"
            });
		}
		else if( this.isDelivery && !this.deliveryKilometer ){
			alert({
                title: "error",
                message: "Necesita poner el kilometraje adicional antes de guardar las imagenes",
                okButtonText: "Ok"
            });
		}
		else if( Number(this.mode) === 2 && !this.devolutionState ){
			alert({
                title: "error",
                message: "Necesitas poner un estado de devolución",
                okButtonText: "Ok"
            });
		}
		else{

			if( this.isDelivery && this.deliveryKilometer &&  this.deliveryKilometer < this.kilometerLimit  )
			{
				alert({
					title: "error",
					message: "El kilometraje de domicilio no puede ser menor a "+this.kilometerLimit,
					okButtonText: "Ok"
				});
				return
			}

			if( this.kilometersRegistered < this.kilometerLimit   ){
				alert({
					title: "error",
					message: "El kilometraje de servicio no puede ser menor a "+this.kilometerLimit,
					okButtonText: "Ok"
				});
				return
			}

			//console.log("frontCameraImage",this.frontCameraImage)

			if(	!this.frontCameraImage ||
				!this.leftCameraImage ||
				!this.rightCameraImage ||
				!this.backCameraImage ||
				!this.odometerCameraImage 
			)
			{
				alert({
					title: "error",
					message: "Necesitas poner todas las imagenes obligatorias para continuar",
					okButtonText: "Ok"
				});
			}else{
				/*alert({
					title: "Bien",
					message: "Imagenes guardadas",
					okButtonText: "Ok"
				});*/
				this.sendPics()
			}

				
		}
		console.log("validate save images")
	}

	registerKilometers(){

		let title = ""

		if(this.isDelivery)
		{
			title = "¿Cual es el kilometraje final?"
		}
		else{
			title = "¿Cual es el kilometraje actual?"
		}

		const kilometers = this.kilometersRegistered ? this.kilometersRegistered.toString() : this.kilometerLimit.toString()

		prompt({title, defaultText:kilometers,
		 inputType:"number",okButtonText: "CONTINUAR"}).then(r => {
			console.log("Dialog result: " + r.result + ", text: " + r.text);
			if(r.result)
			{
				this.kilometersRegistered = Number(r.text)
			}
		});
	}

	registerAditionalKilometers(){
		
		console.log("this.mode",this.mode)

		const kilometers = this.deliveryKilometer ? this.deliveryKilometer.toString() : this.kilometerLimit.toString()

		if( Number(this.mode) === 1 )
		{
			prompt({title:"¿cual es el kilometraje antes de ir al domicilio?", defaultText:kilometers,
			inputType:"number",okButtonText: "CONTINUAR"}).then(r => {
				//console.log("Dialog result: " + r.result + ", text: " + r.text);
				if(r.result)
				{
					if(r.text.length > 0)
					{
						this.deliveryKilometer = Number(r.text)
					}					
				}
			});
		}
		else{
			prompt({title:"¿cual es el kilometraje antes de ir nuevamente a los patios?", defaultText:kilometers,
			inputType:"number",okButtonText: "CONTINUAR"}).then(r => {
				//console.log("Dialog result: " + r.result + ", text: " + r.text);
				if(r.result)
				{
					if(r.text.length > 0)
					{
						this.deliveryKilometer = Number(r.text)
					}
				
				}
			});
		}
	}

	sendPics(){
		console.log("Enviar fotos");

		if(this.synchronized)
		{
			alert({
				title: "espera",
				message: "Este proceso ya fue enviado al servidor",
				okButtonText: "Ok"
			});

			return
		}

		this.isFetching = true

		const appointmentPicture = {
			frontCameraImage:this.frontCameraImage,
			leftCameraImage:this.leftCameraImage,
			rightCameraImage:this.rightCameraImage,
			backCameraImage:this.backCameraImage,
			odometerCameraImage:this.odometerCameraImage,
			contractImage:this.contractImage,
			checkCameraImage:this.checkCameraImage,
			inventoryCameraImage:this.inventoryCameraImage,
			aditional1Image:this.aditional1Image,
			aditional2Image:this.aditional2Image,
			pictureTimes:this.pictureTimes,
			kilometersRegistered:this.kilometersRegistered,
			mode:this.mode,
			deliveryKilometer:this.deliveryKilometer,
			devolutionState:this.devolutionState
		}

	

		this.store.dispatch( new SetAppointmentPictures({ appointment:this.appointment, data: appointmentPicture }) )

		const type = String(this.mode) === "1" ? "deliver" : "devolution"

		let frontImageSrc: ImageSource
		let leftImageSrc: ImageSource
		let rightImageSrc: ImageSource
		let backImageSrc: ImageSource
		let odometerImageSrc: ImageSource
		let contractImageSrc: ImageSource
		let checkImageSrc: ImageSource
		let inventoryImageSrc: ImageSource
		let aditional1ImageSrc: ImageSource
		let aditional2ImageSrc: ImageSource 

		if(appointmentPicture.frontCameraImage)
		{
			frontImageSrc = fromFile(String(appointmentPicture.frontCameraImage))
		}

		if(appointmentPicture.leftCameraImage)
		{
			leftImageSrc = fromFile(String(appointmentPicture.leftCameraImage))
		}

		if(appointmentPicture.rightCameraImage)
		{
			rightImageSrc = fromFile(String(appointmentPicture.rightCameraImage))
		}

		if(appointmentPicture.backCameraImage)
		{
			backImageSrc = fromFile(String(appointmentPicture.backCameraImage))
		}

		if(appointmentPicture.odometerCameraImage)
		{
			odometerImageSrc = fromFile(String(appointmentPicture.odometerCameraImage))
		}

		if(appointmentPicture.contractImage)
		{
			contractImageSrc = fromFile(String(appointmentPicture.contractImage))
		}

		if(appointmentPicture.checkCameraImage)
		{
			checkImageSrc = fromFile(String(appointmentPicture.checkCameraImage))
		}

		if(appointmentPicture.inventoryCameraImage)
		{
			inventoryImageSrc = fromFile(String(appointmentPicture.inventoryCameraImage))
		}

		if(appointmentPicture.aditional1Image)
		{
			aditional1ImageSrc = fromFile(String(appointmentPicture.aditional1Image))
		}

		if(appointmentPicture.aditional2Image)
		{
			aditional2ImageSrc = fromFile(String(appointmentPicture.aditional2Image))
		}
       

		this.citasService.saveAppointment({
			appointment:this.appointment,
			type,
			frontImageSrc:  frontImageSrc && frontImageSrc.toBase64String("jpeg",65),
			leftImageSrc:leftImageSrc && leftImageSrc.toBase64String("jpeg",65),
			rightImageSrc: rightImageSrc && rightImageSrc.toBase64String("jpeg",65),
			backImageSrc: backImageSrc && backImageSrc.toBase64String("jpeg",65),
			odometerImageSrc: odometerImageSrc && odometerImageSrc.toBase64String("jpeg",65),
			contractImageSrc: contractImageSrc && contractImageSrc.toBase64String("jpeg",65),
			checkImageSrc: checkImageSrc && checkImageSrc.toBase64String("jpeg",65),
			inventoryImageSrc: inventoryImageSrc && inventoryImageSrc.toBase64String("jpeg",65),
			aditional1ImageSrc: aditional1ImageSrc && aditional1ImageSrc.toBase64String("jpeg",65),
			aditional2ImageSrc: aditional2ImageSrc && aditional2ImageSrc.toBase64String("jpeg",65),
			
			/*leftImageSrc:frontImageSrc.toBase64String("jpeg",65),
			rightImageSrc:frontImageSrc.toBase64String("jpeg",65),
			backImageSrc:frontImageSrc.toBase64String("jpeg",65),
			odometerImageSrc:frontImageSrc.toBase64String("jpeg",65),
			contractImageSrc:frontImageSrc.toBase64String("jpeg",65),
			checkImageSrc:frontImageSrc.toBase64String("jpeg",65),
			inventoryImageSrc:frontImageSrc.toBase64String("jpeg",65), 
			aditional1ImageSrc:frontImageSrc.toBase64String("jpeg",65), 
			aditional2ImageSrc:frontImageSrc.toBase64String("jpeg",65), */

			pictureTimes:appointmentPicture.pictureTimes,
			kilometersRegistered:appointmentPicture.kilometersRegistered,
			deliveryKilometer:appointmentPicture.deliveryKilometer,
			devolutionState:appointmentPicture.devolutionState,
			userN:this.userN,
			userId:this.userId

		  }).subscribe( 
			result => {
				console.log('result',result["message"])
				//response["message"] === "ok"
				this.store.dispatch( new SetAppointmentPictures({ appointment:this.appointment,
					data: { ...appointmentPicture, synchronized:true } }) )

					this.isFetching = false

				alert({
					title: "bien",
					message: "Enviado al servidor",
					okButtonText: "Ok"
				});
        
			},
		  	error => {

				this.isFetching = false

				alert({
					title: "error",
					message: "Ha sucedido un error",
					okButtonText: "Ok"
				});
		  })


	}

	serverPicLoaded(){

	}

	showPics(){
		
		const type = getConnectionType();

        console.log("connection type",type)

        if( type === connectionType.none || type === connectionType.bluetooth )
        {

		}
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

	assignState(){
		this.modalService.showModal(StatesDevolutionModalComponent, this.options).then((result: any) => {

			//console.log("after modal");
			//console.log(result);

			if(result)
			{
				console.log("state result",result)

				this.devolutionState = result.state.id
			}



		});
	}

}
