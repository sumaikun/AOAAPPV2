import { ItemEventData } from "tns-core-modules/ui/list-view"
import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { Page } from "tns-core-modules/ui/page";
import { OfficefiltermodalComponent } from "../modals/officeFilterModal.component";
//import { PlatefiltermodalComponent } from "../modals/plateFilterModal.component";
import { InfoappointmentComponent } from "../infoAppointmentModal/infoAppointment.component";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { RouterExtensions } from "nativescript-angular/router";
//flux
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState, selectAppState, selectAuthState, selectCitasState, selectOfficeState } from '../flux/app.states';
import { GetCitasEntrega , GetCitasDevolucion , GetCitasSiniestrosInfo } from "../flux/actions/citas.actions";
import { IsFetching } from '../flux/actions/app.actions';

//app Singleton
import { properties } from '../properties';

//moment
import * as moment from 'moment';

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


	deliverAppointments: any[] = [];
	devolutionAppointments: any[] = [];

	TabTitle: string;
	infoDate: String;
	infoOffice: string;

	isAdmin: boolean;

	offices: any[] = [];

	options: ModalDialogOptions = {
			viewContainerRef: this.viewContainerRef,
			fullscreen: false,
			context: {}
	};

	tabSelectedIndex: number;


	constructor(private page: Page, private modalService: ModalDialogService
			, private viewContainerRef: ViewContainerRef, private store: Store<AppState>
			,	private router: RouterExtensions) {
				this.getAppState = this.store.select(selectAppState);
				this.getAppointmentsState = this.store.select(selectCitasState);
				this.getAuthState = this.store.select(selectAuthState);
				this.getOfficeState = this.store.select(selectOfficeState);
	}

	ngOnInit(): void {

		console.log("init appointment component",localStorage.getItem("selectedTab"))

		if(localStorage.getItem("selectedTab"))
		{
			this.tabSelectedIndex = Number(localStorage.getItem("selectedTab"))
		}
		else{
			this.tabSelectedIndex = 0
		}		

		
		this.page.actionBarHidden = true;

		this.getAuthState.subscribe( (state) =>
		{
			//console.log("authState",state)
			//let officeFiltered = this.offices.filter( data => data.id === state.userData.datosFlota.oficina );
			if(state.userData.isAdmin)
			{
				this.isAdmin = true;
			}
			else{
				this.isAdmin = false;
			}
			
		});

		this.getAppState.subscribe( (state) =>
		{
			this.isFetching = state.isFetching;
		});

		this.getOfficeState.subscribe( (state) =>
		{
			//console.log("office State",state);
			
			this.offices = state.userOffices;
			
			//console.log("current info",this.infoOffice)

			if(!this.infoOffice)
			{
				this.infoOffice = state.userOffices[0].name;
			}
			
			
		});

		this.getAppointmentsState.subscribe( (state) =>
		{

			//console.log("Citas State",state);
			 

			if(state.filteredOffice && state.filteredDate)
			{
				console.log("filteredOffice "+state.filteredOffice,state.filteredDate);
				let officeFiltered = this.offices.filter( data => data.id === state.filteredOffice );
				//console.log(officeFiltered);
				if(officeFiltered[0])
				{
					//when filter
					this.infoOffice = officeFiltered[0].name;
				}

				this.infoDate = state.filteredDate;


				this.deliverAppointments = state.DeliverAppointments.filter( data =>{ return data.oficina === officeFiltered[0].id  &&
					moment(data.fecha).format("YYYY-MM-DD") === moment(this.infoDate.toString()).format("YYYY-MM-DD") })

				this.devolutionAppointments = state.DevolAppointments.filter( data => {
					//console.log(moment(data.fec_devolucion).format("YYYY-MM-DD"))
					return data.oficina === officeFiltered[0].id &&
					moment(data.fec_devolucion).format("YYYY-MM-DD") === moment(this.infoDate.toString()).format("YYYY-MM-DD") })

			}
			else{
				
				//console.log(moment(new Date()).format("YYYY-MM-DD"))

				console.log("autofilter")

				console.log(state)

				this.deliverAppointments = state.DeliverAppointments.filter( data =>{ 
					
					console.log(data.oficina,this.offices[0].id)

					console.log(moment(data.fecha).format("YYYY-MM-DD"),moment(new Date()).format("YYYY-MM-DD"))
					
					return data.oficina === this.offices[0].id  &&
					moment(data.fecha).format("YYYY-MM-DD") === moment(new Date()).format("YYYY-MM-DD") 
				
				})

				this.devolutionAppointments = state.DevolAppointments.filter( data => {
					//console.log(moment(data.fec_devolucion).format("YYYY-MM-DD"))
					return data.oficina === this.offices[0].id &&
					moment(data.fec_devolucion).format("YYYY-MM-DD") === moment(new Date()).format("YYYY-MM-DD") })				
				
				//console.log(this.devolutionAppointments,this.deliverAppointments)

				this.infoDate = new Date().getFullYear() + "-"
				+ ( new Date().getMonth() + 1 > 9 ?  new Date().getMonth() + 1 : "0"+ ( new Date().getMonth() + 1 ) )
				+ "-" +  ( new Date().getDate()  > 9 ?  new Date().getDate() : "0"+ ( new Date().getDate()  ) ) ;
				
			}


			//this.devolutionAppointments = state.DevolAppointments;
			//this.deliverAppointments = state.DeliverAppointments;
			
		});

		this.TabTitle = "Citas de entrega";

		


	}

	officeSearch(): void {		

		this.modalService.showModal(OfficefiltermodalComponent, this.options).then((result: any) => {

			//console.log("after modal");
			//console.log(result);

			if(result)
			{
				console.log("filtered result",result)

				this.store.dispatch(new IsFetching(true));

				this.store.dispatch(new GetCitasEntrega({office:result.office,
					date:result.date, keepFetching:true
				}));

				this.store.dispatch(new GetCitasDevolucion({office:result.office,
					date:result.date
				}));

				this.tabSelectedIndex = Number(localStorage.getItem("selectedTab")) ? Number(localStorage.getItem("selectedTab")) : 0
			}



		});
	}

	/*plateSearch(): void {

			this.modalService.showModal(PlatefiltermodalComponent, this.options).then((result: any) => {

			});
	}*/

	onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
		this.TabTitle = args.newIndex == 0 ? "Citas de entrega":"Citas de devolución";
		localStorage.setItem("selectedTab",args.newIndex.toString())
	}			
  

	onDeliverTap(args: ItemEventData): void {
		//console.log(this.deliverAppointments[args.index]);

		this.store.dispatch(new IsFetching(true));

		const cb = (success , error) => {

			if(success)
			{
				this.tabSelectedIndex = 0					

				this.options.context.appointment = this.deliverAppointments[args.index].citaid
				//console.log("options",this.options)
				this.modalService.showModal(InfoappointmentComponent, this.options).then((result: any) => {
					let self = this;
					console.log("deliver tap");
					//console.log(result);
					if(result)
					{
						setTimeout( function(){
							  self.router.navigate(["/fotos", 1]);
								//self.router.navigateByUrl('/fotos');
					  }, 300);
					}
		
				});
			}
			if(error){
				console.log("error callback injected in singleton")
			}
		}

		properties.addCb(cb)

		this.store.dispatch(new GetCitasSiniestrosInfo({
			idAppointment:this.deliverAppointments[args.index].citaid
		}));

		
	}

	onDevolutionTap(args: ItemEventData): void {
		//console.log(this.devolutionAppointments[args.index]);		

		const selectedCitaid = this.devolutionAppointments[args.index].citaid

		//console.log("devolution tap",selectedCitaid)

		this.store.dispatch(new IsFetching(true));

		const cb = (success , error) => {
			if(success)
			{
				this.tabSelectedIndex = 1
				this.options.context.appointment = selectedCitaid
				this.modalService.showModal(InfoappointmentComponent, this.options).then((result: any) => {
					let self = this;
					console.log("devolution tap");
					//console.log(result);
					if(result)
					{
						setTimeout( function(){
								self.router.navigate(["/fotos", 2]);
								//self.router.navigateByUrl('/fotos');
					  }, 300);
		
					}
				});
			}
			if(error){
				console.log("error callback injected in singleton")
			}
		}

		const payload = {
			idAppointment:selectedCitaid
		}

		properties.addCb(cb)

		this.store.dispatch(new GetCitasSiniestrosInfo(payload));		
		

	}

}
