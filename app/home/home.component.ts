import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Page } from "tns-core-modules/ui/page";

import { properties } from '../properties';

//flux
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState, selectAppState } from '../flux/app.states';

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {

    getState: Observable<any>;
    isFetching: boolean | null;

    constructor(private page: Page, private store: Store<AppState>) {
      this.getState = this.store.select(selectAppState);    
    }

    ngOnInit(): void {

        this.page.actionBarHidden = true;

        this.getState.subscribe( (state) =>
        {
            this.isFetching = state.isFetching;
        });

    }


}
