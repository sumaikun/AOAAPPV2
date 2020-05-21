import { Component, OnInit } from "@angular/core";
import { registerElement } from 'nativescript-angular/element-registry';
import { FilterSelect } from 'nativescript-filter-select';
registerElement('FilterSelect', () => FilterSelect);

import { ModalDialogParams } from "nativescript-angular/modal-dialog";

import { prompt, alert } from "tns-core-modules/ui/dialogs";

import * as moment from 'moment';

import { IsFetching, CreateEvent } from '../flux/actions/app.actions';

import { Store } from '@ngrx/store';

@Component({
	selector: "ActivitiesRegistermodal",
	moduleId: module.id,
	templateUrl: "./activitiesRegister.component.html",
	styleUrls: ['./activitiesRegister.component.css']
})
export class ActivitiesRegistermodalComponent implements OnInit {
	
	eventTypes: Array<any>
	activitiesTypes: Array<any>
	params:any;
	activity:any;

	constructor(private _params: ModalDialogParams,private store: Store<{}>) {
		//this.items = [{ "name": "Afghanistan", "code": "AF" }, { "name": "Albania", "code": "AL" }, { "name": "United Kingdom", "code": "GB" }, { "name": "Tunisia", "code": "TN" }, { "name": "Tanzania, United Republic of", "code": "TZ" }];
		this.params = _params
		//console.log("params", this.params)
		this.eventTypes = this.params.context.eventTypes
		this.activitiesTypes =  this.params.context.activitiesTypes
		this.activity = { eventType:"" , description:"" , activityType:"",
		 longitude: this.params.context.longitude,  latitude: this.params.context.latitude,
		 id:this.params.context.id  }
	}

	ngOnInit(): void {
	}

	onitemselected(args): void{
		console.log("selected", args.selected)
		this.activity.eventType = args.selected.id
	}

	onitemselected2(args): void{
		console.log("selected", args.selected)
		this.activity.activityType = args.selected.id
	}

	saveActivity(): void{

		this.activity.eventDate = moment(). format('YYYY-MM-DD H:MM:s')
		console.log("save activity",this.activity)
		//console.log("current time",moment(). format('YYYY-MM-DD H:MM:s'))

		if(this.activity.eventType === "")
		{
			alert("Necesito registrar el tipo de evento para continuar")
			return;
		}

		if(this.activity.eventType === "7"  || this.activity.eventType === "9")
		{
			if(this.activity.activityType === "")
			{
				alert("Necesito registrar el tipo de actividad para continuar")
				return;
			}
		}

		this.store.dispatch(new IsFetching(true));
		this.store.dispatch(new CreateEvent(this.activity));

		//alert('Actividad guardada')

		this.params.closeCallback();
	}
}