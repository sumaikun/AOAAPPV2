import { Component, OnInit } from "@angular/core";
import { AppState, selectCitasState } from '../flux/app.states';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { RouterExtensions } from "nativescript-angular/router";
import { alert } from "tns-core-modules/ui/dialogs";
import { startMonitoring, stopMonitoring }from "tns-core-modules/connectivity";
import * as connectivityModule from "tns-core-modules/connectivity";
import { CitasService } from "../services/citas.services";

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
	loading : boolean;
	resultCheck: string; 
	foundKilometer: string; 

	constructor(private store: Store<AppState>,
		 private citasService: CitasService,
		 private _params: ModalDialogParams,
		 private router: RouterExtensions) {
		this.getAppointmentsState = this.store.select(selectCitasState);
		this.params = _params
		this.loading = true
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
				console.log("data",state.siniesterInfo[siniesterInfo])
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

		startMonitoring( async (type) => {

			if( type === connectivityModule.connectionType.wifi || type ===  connectivityModule.connectionType.mobile )
			{
				//console.log("with internet",this.params.context.mode)

				if(this.params.context.mode === 1)
				{
					console.log("check operator deliver")
					const response = await this.citasService.checkAssignInDeliver(this.params.context.userId,this.params.context.appointment).toPromise()
					console.log("response",response["message"],response["operatorResult"])
					const validation = response["message"]
					if(validation["operario_domicilio"] === 0){
						console.log("time to assign operator")
						this.resultCheck = "assign"
					}
					else{
						
						if(validation["operario_domicilio"] === this.params.context.userId )
						{
							this.resultCheck = "continue"
						}else{
							this.resultCheck = "not allowed"
							alert({
								title: "espera",
								message: "esta cita fue tomada por otro operario: "+response["operatorResult"][0].nombre+" "+response["operatorResult"][0].apellido,
								okButtonText: "Ok"
							})
						}
					}

				}else{
					console.log("check operator devolution")
					const response = await this.citasService.checkAssignInDevolution(this.params.context.userId,this.params.context.appointment).toPromise()
					console.log("response",response["message"],response["operatorResult"])
					const validation = response["message"]
					if(validation["operario_domiciliod"] === 0){
						console.log("time to assign operator")
						this.resultCheck = "assign"
					}
					else{
						const validation = response["message"]
						if(validation["operario_domiciliod"] === this.params.context.userId )
						{
							this.resultCheck = "continue"
						}else{
							this.resultCheck = "not allowed"
							alert({
								title: "espera",
								message: "esta cita fue tomada por otro operario: "+response["operatorResult"][0].nombre+" "+response["operatorResult"][0].apellido,
								okButtonText: "Ok"
							})
						}
					}
				}

				this.loading = false
				
			}
			else{
				console.log("no internet")
				this.loading = false
			}		
				
			
		});
	}

	async onButtonTap() {

		if(this.resultCheck === "assign" && this.params.context.mode === 1)
		{
			await this.citasService.AssignInDeliver({appointment:this.params.context.appointment,operatorId:this.params.context.userId}).toPromise()
		}

		if(this.resultCheck === "assign" && this.params.context.mode === 2)
		{
			await this.citasService.AssignInDevolution({appointment:this.params.context.appointment,operatorId:this.params.context.userId}).toPromise()
		}

		if(this.resultCheck === "assign" || this.resultCheck === "continue")
		{
			const kilometerResult = await this.citasService.checkKilometerLimit({plate:this.params.context.plate}).toPromise()

			console.log("kilometerResult",kilometerResult)

			this.foundKilometer = kilometerResult["message"]
		} 
		
		let self = this;
		self._params.closeCallback({ proccess:this.resultCheck, foundKilometer:this.foundKilometer });
		
	}

	ngOnDestroy() {
		// Stoping the connection monitoring
		stopMonitoring();
	}

}
