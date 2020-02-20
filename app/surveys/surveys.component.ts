import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";
//flux
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState, selectAppState, selectAuthState } from '../flux/app.states';

@Component({
	selector: "Surveys",
	moduleId: module.id,
	templateUrl: "./surveys.component.html",
	styleUrls: ['./surveys.component.css']
})

export class SurveysComponent implements OnInit {

	getAppState: Observable<any>;
	getAuthState: Observable<any>;
	isFetching: boolean | null;	
	TabTitle: string;

	public items: Array<string> = ["Batman", "Joker", "Bane"];
	

	constructor(private page: Page, private store: Store<AppState>
			,	private router: RouterExtensions) {
				this.getAppState = this.store.select(selectAppState);
				this.getAuthState = this.store.select(selectAuthState);
	}

	ngOnInit(): void {

		console.log("on init");

		this.page.actionBarHidden = true;

		this.getAppState.subscribe( (state) =>
		{
			this.isFetching = state.isFetching;
			console.log(state);
		});

		this.getAuthState.subscribe( (state) =>
		{
			console.log(state);
		});

		this.TabTitle = "Encuesta";		

	}

	

}
