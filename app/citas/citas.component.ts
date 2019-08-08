import { ItemEventData } from "tns-core-modules/ui/list-view"
import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { Page } from "tns-core-modules/ui/page";
import { OfficefiltermodalComponent } from "../modals/officeFilterModal.component";
import { PlatefiltermodalComponent } from "../modals/plateFilterModal.component";
import { InfoappointmentComponent } from "../infoAppointmentModal/infoAppointment.component";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
//flux
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState, selectAppState, selectAuthState, selectCitasState, selectOfficeState } from '../flux/app.states';
import { GetCitasEntrega , GetCitasDevolucion } from "../flux/actions/citas.actions";
import { IsFetching } from '../flux/actions/app.actions';

@Component({
	selector: "Citas",
	moduleId: module.id,
	templateUrl: "./citas.component.html",
	styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {

	getAppState: Observable<any>;
	getAppointmentsState: Observable<any>;
	getAuthState: Observable<any>;
	getOfficeState: Observable<any>;

	isFetching: boolean | null;

	deliverAppointments : { placa: string , hora: string , asegurado: string, conductor:string , id:number }[] = [];
	devolutionAppointments : { placa: string , hora: string, conductor: string, asegurado:string, id:number  }[] = [];

	TabTitle: string;
	infoDate: String;
	infoOffice: string;

	offices: any[] = [];

	options: ModalDialogOptions = {
			viewContainerRef: this.viewContainerRef,
			fullscreen: false,
			context: {}
	};


	constructor(private page: Page, private modalService: ModalDialogService
			, private viewContainerRef: ViewContainerRef, private store: Store<AppState>) {
				this.getAppState = this.store.select(selectAppState);
				this.getAppointmentsState = this.store.select(selectCitasState);
				this.getAuthState = this.store.select(selectAuthState);
				this.getOfficeState = this.store.select(selectOfficeState);


	}

	ngOnInit(): void {

		this.page.actionBarHidden = true;


		this.getAppState.subscribe( (state) =>
		{
				this.isFetching = state.isFetching;
		});

		this.getAppointmentsState.subscribe( (state) =>
		{

			//console.log("Citas State");
			//console.log(state);

			if(state.filteredOffice)
			{
				//console.log("filteredOffice "+state.filteredOffice);
				let officeFiltered = this.offices.filter( data => data.id === state.filteredOffice );
				//console.log(officeFiltered);
				if(officeFiltered[0])
				{
					//when filter
					this.infoOffice = officeFiltered[0].nombre;
				}

			}

			if(state.filteredDate)
			{
				this.infoDate = state.filteredDate;
			}


			state.DeliverAppointments ? this.deliverAppointments = [] : false;

			state.DeliverAppointments ?  state.DeliverAppointments.forEach( cita =>{
					//console.log("entrega");
					//console.log(cita.placa);

					let placa = cita.placa ? cita.placa: "";
					let hora = cita.hora ? cita.hora.substr(0,5): "";
					let asegurado = cita.asegurado_nombre ? cita.asegurado_nombre.substr(0,15): "";
					let conductor = cita.conductor_nombre ?  cita.conductor_nombre.substr(0,15): asegurado;
					let id = cita.citaid ? cita.citaid:"";

					this.deliverAppointments.push({placa,hora,asegurado,conductor,id});

			}) : null ;


			state.DevolAppointments ? this.devolutionAppointments = [] : false;

			state.DevolAppointments ? state.DevolAppointments.forEach( cita =>{

				 //console.log("devolución");
				 //console.log(cita.placa);

				 let placa = cita.placa ? cita.placa: "";
				 let hora = cita.hora_devol ? cita.hora_devol.substr(0,5): "";
				 let asegurado = cita.asegurado_nombre ? cita.asegurado_nombre.substr(0,15): "";
				 let conductor = cita.conductor_nombre ?  cita.conductor_nombre.substr(0,15): asegurado;
				 let id = cita.citaid ? cita.citaid:"";

				 this.devolutionAppointments.push({placa,hora,asegurado,conductor,id});

			}) : null;

		});


		this.getOfficeState.subscribe( (state) =>
		{
			//console.log(state);
			this.offices = state.userOffices;
		});

		this.getAuthState.subscribe( (state) =>
		{
			//console.log(this.offices);
			//console.log(state.userData.datosFlota.oficina);
			let officeFiltered = this.offices.filter( data => data.id === state.userData.datosFlota.oficina );
			//console.log(officeFiltered);
			//Default by Auth
			this.infoOffice = officeFiltered[0].nombre;
		});


		this.TabTitle = "Citas de entrega";

		this.infoDate = new Date().getFullYear() + "-"
		+ ( new Date().getMonth() + 1 > 9 ?  new Date().getMonth() + 1 : "0"+ ( new Date().getMonth() + 1 ) )
		+ "-" +  ( new Date().getDate()  > 9 ?  new Date().getDate() : "0"+ ( new Date().getDate()  ) ) ;



	}

	officeSearch(): void {

			this.modalService.showModal(OfficefiltermodalComponent, this.options).then((result: any) => {

				console.log("after modal");
				console.log(result);

				if(result)
				{
					this.store.dispatch(new IsFetching(true));

					this.store.dispatch(new GetCitasEntrega({office:result.office,
						date:result.date, keepFetching:true
					}));

					this.store.dispatch(new GetCitasDevolucion({office:result.office,
						date:result.date
					}));
				}



			});
	}

	plateSearch(): void {

			this.modalService.showModal(PlatefiltermodalComponent, this.options).then((result: any) => {

			});
	}

	onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
		this.TabTitle = args.newIndex == 0 ? "Citas de entrega":"Citas de devolución";
	}


	onItemTap(args: ItemEventData): void {
			console.log(args);
      console.log('Item with index: ' + args.index + ' tapped');
			this.modalService.showModal(InfoappointmentComponent, this.options);

  }

}
