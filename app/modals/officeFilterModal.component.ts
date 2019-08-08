import { Component, OnInit } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";

//flux
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState, selectAppState, selectOfficeState } from '../flux/app.states';


import { GetCitasEntrega } from '../flux/actions/citas.actions';
import { IsFetching } from '../flux/actions/app.actions';

import { alert, prompt } from "tns-core-modules/ui/dialogs";

@Component({
	selector: "Officefiltermodal",
	moduleId: module.id,
	templateUrl: "./officeFilterModal.component.html",
	styleUrls: ['./officeFilterModal.component.css']
})

export class OfficefiltermodalComponent implements OnInit {

	listPickerOffices: Array<string> = [];
	selectedListPickerIndex: number = 0;
	userOffices: Array<any> = [];
	currentDay: number = new Date().getDate();
	currentMonth: number = new Date().getMonth() + 1;
	currentYear: number = new Date().getFullYear();
	datePickerFormat: String = new Date().getFullYear() + "-"
	+ ( new Date().getMonth() + 1 > 9 ?  new Date().getMonth() + 1 : "0"+ ( new Date().getMonth() + 1 ) )
	+ "-" +  ( new Date().getDate() + 1 > 9 ?  new Date().getDate()  : "0"+ ( new Date().getDate()  ) )  ;

	isFetching: boolean | null;
	getAppState: Observable<any>;
	getOfficeState: Observable<any>;

	constructor( private store: Store<AppState>, private params: ModalDialogParams ) {
		this.getAppState = this.store.select(selectAppState);
		this.getOfficeState = this.store.select(selectOfficeState);
	}

	ngOnInit(): void {
			console.log("On office Modal");

			this.getAppState.subscribe( (state) => {
				this.isFetching = state.isFetching;
			});

			this.getOfficeState.subscribe( (state) => {
				//console.log(state);
				if(state.userOffices.length > 0 && state.userOffices != this.userOffices )
				{
					this.userOffices = state.userOffices;
					this.listPickerOffices = [];
					state.userOffices.forEach( office => {
						//console.log(office.nombre);
						this.listPickerOffices.push(office.nombre);
					});
					//console.log(this.listPickerOffices);
				}
			});

	}

	onDateChanged(args) {

		let formatted_date = args.value.getFullYear() + "-"
		 + (args.value.getMonth() + 1 > 9 ?  args.value.getMonth() + 1 : "0"+ (args.value.getMonth() + 1) )
		 + "-" + ( args.value.getDate() + 1 > 9 ?  args.value.getDate()  : "0"+ ( args.value.getDate() ) );

		console.log(args.value);

		this.datePickerFormat = formatted_date;

	}

	filterOfficeData(): void {
		console.log("Filtrar ciudad");
		console.log(this.datePickerFormat);
		console.log(this.userOffices[this.selectedListPickerIndex].id);
		if(!this.isFetching)
		{
			this.params.closeCallback({office:this.userOffices[this.selectedListPickerIndex].id,
				date:this.datePickerFormat
			});
		}
		else{
			alert({
					title: "Espere",
					message: "¡En este momento estamos realizando su busqueda!",
					okButtonText: "Ok"
			});
		}
	}

}
