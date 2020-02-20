//localStorage
import 'nativescript-localstorage';


import { NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from '@angular/common/http';

import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { CitasComponent } from "./citas/citas.component";
import { CarphotosComponent } from "./carPhotos/carPhotos.component";
import { WatchpicComponent } from "./watchPic/watchPic.component";
import { SurveysComponent } from "./surveys/surveys.component";


//components

import { LoadingComponent } from "./loading/loading.component";
import { PageContainerComponent } from "./pageContainer/pageContainer.component";

//modal
import { OfficefiltermodalComponent } from "./modals/officeFilterModal.component";
import { PlatefiltermodalComponent } from "./modals/plateFilterModal.component";
import { InfoappointmentComponent } from "./infoAppointmentModal/infoAppointment.component";
import { ModalDialogService } from "nativescript-angular/modal-dialog";


//flux
import { AuthService } from './services/auth.service';
import { OfficeService } from './services/office.services';
import { CitasService } from './services/citas.services';

import { StoreModule ,  MetaReducer, ActionReducer  } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './flux/app.states';
import { AuthEffects } from './flux/effects/auth.effects';
import { OfficeEffects } from './flux/effects/offices.effects';
import { CitasEffects } from './flux/effects/citas.effects';

//flux persist

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: ['auth','citas','offices'],rehydrate: true})(reducer);
}

export function localStorageSyncReducer2(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: [{app: ['surveys'] }]})(reducer);
}

import { localStorageSync } from 'ngrx-store-localstorage';

const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer,localStorageSyncReducer2];
 

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        HttpClientModule,
        AppRoutingModule,
        NativeScriptUISideDrawerModule,
        NativeScriptFormsModule,
        StoreModule.forRoot(reducers,{metaReducers}),
        EffectsModule.forRoot([AuthEffects,OfficeEffects,CitasEffects])
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        CitasComponent,
        CarphotosComponent,
        LoadingComponent,
        PageContainerComponent,
        OfficefiltermodalComponent,
    		PlatefiltermodalComponent,
        InfoappointmentComponent,
        WatchpicComponent,
        SurveysComponent
    ],
    providers: [
      AuthService,
      OfficeService,
      CitasService,
      ModalDialogService
    ],
    entryComponents: [
  		OfficefiltermodalComponent,
  		PlatefiltermodalComponent,
      InfoappointmentComponent
  	],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
