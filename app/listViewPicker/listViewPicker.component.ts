import { Component, OnInit } from "@angular/core";
import {  ActivatedRoute, Params } from '@angular/router';
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";
import { ItemEventData } from "tns-core-modules/ui/list-view"
import { confirm, alert } from "tns-core-modules/ui/dialogs";
import { Store } from '@ngrx/store';
import { AppState, selectAppState, selectAuthState   } from '../flux/app.states';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../services/app.services'
import { map } from 'rxjs/operators';
import { IsFetching, SetActiveEvents } from '../flux/actions/app.actions'
import * as moment from 'moment'

@Component({
	selector: "ListViewPicker",
	moduleId: module.id,
	templateUrl: './listViewPicker.component.html',
	styleUrls: ['./listViewPicker.component.css'] 
})
export class ListViewPickerComponent implements OnInit {

  getState: Observable<any>;
  getAuthState: Observable<any>;
  items: Array<any>
  mode: string
  userData: any
  isFetching: boolean | null;

  constructor(private route: ActivatedRoute, private page: Page,
    private appService: AppService,
    private store: Store<AppState>,
		private router: RouterExtensions){
      this.getState = this.store.select(selectAppState);
      this.getAuthState = this.store.select(selectAuthState);
      
  }

  ngOnInit(): void {

    console.log("component of list picker initialized");

    this.page.actionBarHidden = true;

    this.route.params.subscribe((params: Params) => {
      //console.log("params",params)
      //console.log(params,JSON.parse(params.items));
      this.items = Array.isArray(JSON.parse(params.items)) ? JSON.parse(params.items) : [] ;
      //console.log(this.items)
      this.mode = params.mode
    });

    this.getState.subscribe( (state) =>
      {
      
          this.isFetching = state.isFetching;
      }
    )    

    this.getAuthState.subscribe( (state) =>
    {
        //console.log("auth state",state)

        this.userData = state.userData

       
    });
    
  }

  onItemTap(args: ItemEventData): void {

    //console.log(this.items[args.index]);
    
    const itemSelected = this.items[args.index] 

    const self = this

    confirm({ title:"Descripción registrada:",
    message:itemSelected.DESCRIPCION,
    okButtonText: "CERRAR ACTIVIDAD",
    cancelButtonText: "VOLVER"}).then( (result) => {

      if(result)
      {
        switch (self.mode) {
          case "pendingEvents":

            self.appService.closeEvent({ id: itemSelected.ID_EVENTO, closeDate : moment(). format('YYYY-MM-DD H:MM:s') }).subscribe((response:any) => {
              console.log("closeEvent response",response)

              if(response.message === "ok")
              {
                alert({
                  title: "Bien",
                  message: "Actividad finalizada",
                  okButtonText: "Ok"
                });
              }

              self.appService.getActiveEvents(self.userData.id).subscribe((response:any) => {
              
                self.store.dispatch( new IsFetching(true) )
                if(Array.isArray(response.pendingEvents))
                {
                  self.store.dispatch( new SetActiveEvents( response.pendingEvents ) )              
                }
                self.store.dispatch( new IsFetching(false) )
  
                self.items = response.pendingEvents
              });

            })          
            
           

          default:
            break
        }
      } 

  });

  }

	

}