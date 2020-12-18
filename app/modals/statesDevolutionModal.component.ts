import { Component, OnInit } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";

//flux
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState, selectAppState } from '../flux/app.states';

@Component({
	selector: "StatesDevolutionmodal",
	moduleId: module.id,
	templateUrl: "./statesDevolutionModal.component.html",
	styleUrls: ['./statesDevolutionModal.component.css']
})

export class StatesDevolutionModalComponent implements OnInit {

	listPickerStates: Array<string> = [];
	selectedListPickerIndex: number = 0;	
	getAppState: Observable<any>;
	devolutionStates: Array<any> = []


	constructor( private store: Store<AppState>, private params: ModalDialogParams ) {
		this.getAppState = this.store.select(selectAppState);
	}

	ngOnInit(): void {
		
        console.log("On state devolution Modal");
        
        this.getAppState.subscribe( (state) =>
		{
			console.log("app state",state)

			if(state.devolutionStates)
			{
				console.log("state.devolutionStates",state.devolutionStates)
				this.devolutionStates = state.devolutionStates
				state.devolutionStates.forEach( office => {
					//console.log(office);
					this.listPickerStates.push(office.name);
				});
			}
			
			
		});

	}

    
    assignState():void {
		console.log("state:this.selectedListPickerIndex",this.selectedListPickerIndex)
		const state = this.devolutionStates[this.selectedListPickerIndex]
        this.params.closeCallback({state});
    }

}
