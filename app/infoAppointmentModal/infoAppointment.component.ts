import { Component, OnInit } from "@angular/core";
import { AppState, selectCitasState } from '../flux/app.states';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { RouterExtensions } from "nativescript-angular/router";
import { alert } from "tns-core-modules/ui/dialogs";

@Component({
	selector: "Infoappointment",
	moduleId: module.id,
	templateUrl: "./infoAppointment.component.html",
	styleUrls: ['./infoAppointment.component.css']
})
export class InfoappointmentComponent implements OnInit {

	getAppointmentsState: Observable<any>;
	siniesterInfo: any;
	readyToShow: boolean = false;
	params:any;

	constructor(private store: Store<AppState>, private _params: ModalDialogParams, private router: RouterExtensions) {
		this.getAppointmentsState = this.store.select(selectCitasState);
		this.params = _params
	}

	ngOnInit(): void {
		//console.log("modal params",this.params)
		this.getAppointmentsState.subscribe( (state) =>
		{
			//console.log("state on info component",state.siniesterInfo);

			//console.log("data to filter",this.params)

			const siniesterInfo = state.siniesterInfo.findIndex( data => data.citaid ===  this.params.context.appointment) 

			if(siniesterInfo != -1)
			{
				//console.log("data",state.siniesterInfo[siniesterInfo])
				this.siniesterInfo = state.siniesterInfo[siniesterInfo];
				this.readyToShow = true;
			}else{
				console.log("No hay información del siniestro")
				/*alert({
					title: "error",
					message: "No hay información del siniestro, vuelva a buscar la información",
					okButtonText: "Ok"
				});*/
			}

			
		});
	}

	onButtonTap(): void {
		let self = this;
		self._params.closeCallback(true);
		
	}

}
