import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";
import {  ActivatedRoute, Params } from '@angular/router';
//flux
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState, selectAppState, selectAuthState } from '../flux/app.states';


import { PhotoEditor, PhotoEditorControl } from "nativescript-photo-editor";


import { ImageSource , fromUrl } from "tns-core-modules/image-source";

@Component({
	selector: "Surveys",
	moduleId: module.id,
	templateUrl: "./surveys.component.html",
	styleUrls: ['./surveys.component.css']
})

export class SurveysComponent implements OnInit {

	getAppState: Observable<any>;
	getAuthState: Observable<any>;
	isFetching: boolean | null;	
	TabTitle: string;
	mode:string;
	appointment:string;
	surveys: any[];
	acts: any[];

	drawImage:ImageSource;

	constructor(private page: Page, private store: Store<AppState>,
			private route: ActivatedRoute,
			private router: RouterExtensions) {
				this.getAppState = this.store.select(selectAppState);
				this.getAuthState = this.store.select(selectAuthState);
	}

	ngOnInit(): void {

		console.log("on init");

		this.page.actionBarHidden = true;

		this.route.params.subscribe((params: Params) => {
			console.log("params",params);
			this.mode = params.mode;
			this.appointment = params.appointment
			
			if(this.mode === "survey")
			{
				this.TabTitle = "Encuesta";	
			}
			else if(this.mode === "act")
			{
				this.TabTitle = "Acta de entrega";	
			}
			else{
				this.TabTitle = "Error";				
			}

		});

		this.getAppState.subscribe( (state) =>
		{
			this.isFetching = state.isFetching;
			console.log(state);
			this.surveys = state.surveys.survey
			this.acts = state.act.items

			console.log("surveys",this.surveys.length)
			console.log("acts",this.acts.length)

		});

		this.getAuthState.subscribe( (state) =>
		{
			console.log(state);
		});

			

	}

	async editPicture(){	
		
		console.log("edit picture")

		const photoEditor = new PhotoEditor();

		photoEditor.editPhoto({
			imageSource: this.drawImage ? this.drawImage : await fromUrl("https://app.aoacolombia.com/Control/operativo/lineavehiculo/g/04-20-2017-Camioneta-SUV.jpg"),
			hiddenControls: [
				PhotoEditorControl.Crop,
				PhotoEditorControl.Text
			],
		}).then((newImage: ImageSource) => {
			console.log("image ready")
			//resultImage.imageSource = newImage;
			console.log(newImage)
			this.drawImage = newImage		
		}).catch((e) => {
			console.error(e);
		});
	}

	

}
