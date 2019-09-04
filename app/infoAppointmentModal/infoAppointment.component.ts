import { Component, OnInit } from "@angular/core";
import { AppState, selectCitasState } from '../flux/app.states';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { RouterExtensions } from "nativescript-angular/router";

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

	constructor(private store: Store<AppState>, private _params: ModalDialogParams, private router: RouterExtensions) {
		this.getAppointmentsState = this.store.select(selectCitasState);
	}

	ngOnInit(): void {
		this.getAppointmentsState.subscribe( (state) =>
		{
			this.siniesterInfo = state.siniesterInfo;
			this.readyToShow = true;
		});
	}

	onButtonTap(): void {
		let self = this;
		self._params.closeCallback(true);
		
	}

}
