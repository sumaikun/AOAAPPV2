import { ItemEventData } from "tns-core-modules/ui/list-view"
import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { prompt } from "tns-core-modules/ui/dialogs";
import { Page } from "tns-core-modules/ui/page";
import { OfficefiltermodalComponent } from "../modals/officeFilterModal.component";
//import { PlatefiltermodalComponent } from "../modals/plateFilterModal.component";
import { InfoappointmentComponent } from "../infoAppointmentModal/infoAppointment.component";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { RouterExtensions } from "nativescript-angular/router";
//flux
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState, selectAppState, selectAuthState, selectCitasState, selectOfficeState , selectApiloadsState } from '../flux/app.states';
import { GetCitasEntrega , GetCitasDevolucion , GetCitasSiniestrosInfo } from "../flux/actions/citas.actions";
import { IsFetching } from '../flux/actions/app.actions';
import { SetAppointmentPictures } from '../flux/actions/apiloads.actions'

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
	getApiloadsState: Observable<any>;

	isFetching: boolean | null;


	deliverAppointments: any[] = [];
	devolutionAppointments: any[] = [];

	TabTitle: string;
	infoDate: String;
	infoOffice: string;

	isAdmin: boolean;
	userId: string;

	offices: any[] = [];

	options: ModalDialogOptions = {
			viewContainerRef: this.viewContainerRef,
			fullscreen: false,
			context: {}
	};

	tabSelectedIndex: number;
	
	appointmentsPictures:any


	constructor(private page: Page, private modalService: ModalDialogService
			, private viewContainerRef: ViewContainerRef, private store: Store<AppState>
			,	private router: RouterExtensions) {
				this.getAppState = this.store.select(selectAppState);
				this.getAppointmentsState = this.store.select(selectCitasState);
				this.getAuthState = this.store.select(selectAuthState);
				this.getOfficeState = this.store.select(selectOfficeState);
				this.getApiloadsState = this.store.select(selectApiloadsState)
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
			console.log("authState",state)
			//let officeFiltered = this.offices.filter( data => data.id === state.userData.datosFlota.oficina );
			if(state.userData.isAdmin)
			{
				this.isAdmin = true;
			}
			else{
				this.isAdmin = false;
			}

			this.userId = state.userData.id
			
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

		this.getApiloadsState.subscribe( (state) => {
			const { appointmentsPictures } = state

			//console.log("appointmentsPictures",appointmentsPictures)

			this.appointmentsPictures = appointmentsPictures
		})

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

				console.log("this.appointmentsPictures",this.appointmentsPictures)



				this.deliverAppointments = state.DeliverAppointments.filter( data =>{ 

					/*if( this.appointmentsPictures[String(data.citaid)] )
					{
						return data.oficina === officeFiltered[0].id  && moment(data.fecha).format("YYYY-MM-DD") === moment(this.infoDate.toString()).format("YYYY-MM-DD") && !this.appointmentsPictures[String(data.citaid)].synchronized
					}else{
						return data.oficina === officeFiltered[0].id  && moment(data.fecha).format("YYYY-MM-DD") === moment(this.infoDate.toString()).format("YYYY-MM-DD")
					}*/
					return data.oficina === officeFiltered[0].id  && moment(data.fecha).format("YYYY-MM-DD") === moment(this.infoDate.toString()).format("YYYY-MM-DD")
				})

				//console.log("deliverAppointments",this.deliverAppointments,state.DeliverAppointments)

				this.devolutionAppointments = state.DevolAppointments.filter( data => {
					/*if( this.appointmentsPictures[String(data.citaid)] )
					{
						return data.oficina === officeFiltered[0].id &&
						moment(data.fec_devolucion).format("YYYY-MM-DD") === moment(this.infoDate.toString()).format("YYYY-MM-DD") && !this.appointmentsPictures[String(data.citaid)].synchronized
					}else{
						return data.oficina === officeFiltered[0].id &&
						moment(data.fec_devolucion).format("YYYY-MM-DD") === moment(this.infoDate.toString()).format("YYYY-MM-DD")
					}*/					
					return data.oficina === officeFiltered[0].id &&
						moment(data.fec_devolucion).format("YYYY-MM-DD") === moment(this.infoDate.toString()).format("YYYY-MM-DD")
				})

			}
			else{
				
				//console.log(moment(new Date()).format("YYYY-MM-DD"))

				console.log("autofilter")

				console.log("this.appointmentsPictures",this.appointmentsPictures)

				//console.log(state)

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

		const selectedCitaid = this.deliverAppointments[args.index].citaid

		this.store.dispatch(new IsFetching(true));

		const cb = (success , error) => {

			if(success)
			{
				this.tabSelectedIndex = 0					

				this.options.context.appointment = this.deliverAppointments[args.index].citaid
				this.options.context.plate = this.deliverAppointments[args.index].placa
				this.options.context.mode = 1
				this.options.context.userId = this.userId

				//console.log("options",this.options)
				this.modalService.showModal(InfoappointmentComponent, this.options).then((result: any) => {
					let self = this;
					console.log("deliver tap");
					console.log(result);
					if(result)
					{
						//console.log("current full appointment",this.deliverAppointments[args.index])
						const defaultVlue = result.foundKilometer ? result.foundKilometer : "0"

						if(this.deliverAppointments[args.index].dir_domicilio || this.deliverAppointments[args.index].tel_domicilio)
						{	
							if(result.proccess === "assign" )
							{
								prompt({title:"¿cual es el kilometraje antes de ir al domicilio?", defaultText:defaultVlue,
								inputType:"number",okButtonText: "CONTINUAR"}).then(r => {
									//console.log("Dialog result: " + r.result + ", text: " + r.text);
									if(r.result)
									{
										if(r.text.length > 0)
										{
											this.store.dispatch( new SetAppointmentPictures({ appointment:selectedCitaid, data: {   ...this.appointmentsPictures[selectedCitaid], deliveryKilometer: r.text, kilometerLimit : defaultVlue, proccess:result.proccesss  } }) )
										}

										setTimeout( function(){
											self.router.navigate(["/fotos", 1, selectedCitaid,true]);
											//self.router.navigateByUrl('/fotos');
										}, 300);	
									}
								});
							}else{
								this.store.dispatch( new SetAppointmentPictures({ appointment:selectedCitaid, data: {   ...this.appointmentsPictures[selectedCitaid], kilometerLimit : defaultVlue, proccess:result.proccesss  } }) )
								setTimeout( function(){
									self.router.navigate(["/fotos", 1, selectedCitaid,true]);
									//self.router.navigateByUrl('/fotos');
								}, 300);
							}
							
						}
						else{
							this.store.dispatch( new SetAppointmentPictures({ appointment:selectedCitaid, data: {  ...this.appointmentsPictures[selectedCitaid], kilometerLimit : defaultVlue, proccess:result.proccesss  } }) )
							setTimeout( function(){
								self.router.navigate(["/fotos", 1, selectedCitaid,false]);
								//self.router.navigateByUrl('/fotos');
								
							}, 300);
						}
						
						
					}
		
				});
			}
			if(error){
				console.log("error callback injected in singleton",error)
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
				this.options.context.plate = this.devolutionAppointments[args.index].placa
				this.options.context.mode = 2
				this.options.context.userId = this.userId

				this.modalService.showModal(InfoappointmentComponent, this.options).then((result: any) => {
					let self = this;
					console.log("devolution tap");
					//console.log(result);
					if(result)
					{
						console.log("current full appointment",this.devolutionAppointments[args.index])

						const defaultVlue = result.foundKilometer ? result.foundKilometer : "0"

						if( this.devolutionAppointments[args.index].dir_domiciliod || this.devolutionAppointments[args.index].tel_domiciliod)
						{
							if(result.proccess === "assign" )
							{
								prompt({title:"¿cual es el kilometraje antes de ir nuevamente a los patios?", defaultText:defaultVlue,
								inputType:"number",okButtonText: "CONTINUAR"}).then(r => {
									//console.log("Dialog result: " + r.result + ", text: " + r.text);
									if(r.result)
									{
										if(r.text.length > 0)
										{
											this.store.dispatch( new SetAppointmentPictures({  appointment:selectedCitaid, data: {   ...this.appointmentsPictures[selectedCitaid], deliveryKilometer: r.text , kilometerLimit : defaultVlue, proccess:result.proccess  } }) )
										}

										setTimeout( function(){
											self.router.navigate(["/fotos", 2, selectedCitaid,true]);
											//self.router.navigateByUrl('/fotos');
										}, 300);
									}
								});
							}else{
								this.store.dispatch( new SetAppointmentPictures({  appointment:selectedCitaid, data: {  ...this.appointmentsPictures[selectedCitaid], kilometerLimit : defaultVlue, proccess:result.proccesss  } }) )
								setTimeout( function(){
									self.router.navigate(["/fotos", 2, selectedCitaid,true]);
									//self.router.navigateByUrl('/fotos');
								}, 300);
							}
							
						}
						else{
							this.store.dispatch( new SetAppointmentPictures({   appointment:selectedCitaid, data: {  ...this.appointmentsPictures[selectedCitaid], kilometerLimit : defaultVlue, proccess:result.proccesss  } }) )
							setTimeout( function(){
								self.router.navigate(["/fotos", 2, selectedCitaid,false]);
								//self.router.navigateByUrl('/fotos');
								
					  	}, 300);
						}
		
					}
				});
			}
			if(error){
				console.log("error callback injected in singleton",error)
			}
		}

		const payload = {
			idAppointment:selectedCitaid
		}

		properties.addCb(cb)

		this.store.dispatch(new GetCitasSiniestrosInfo(payload));		
		

	}

}
