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


	constructor( private store: Store<AppState>, private params: ModalDialogParams ) {
		this.getAppState = this.store.select(selectAppState);
	}

	ngOnInit(): void {
		
        console.log("On state devolution Modal");
        
        this.getAppState.subscribe( (state) =>
		{

			if(state.devolutionStates)
			{
				this.listPickerStates = state.devolutionStates
			}
			
			
		});

	}

    
    assignState():void {
        this.params.closeCallback({state:this.selectedListPickerIndex});
    }

}
