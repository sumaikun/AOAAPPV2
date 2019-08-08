import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { LoadingComponent } from "./loading/loading.component";
import { PageContainerComponent } from "./pageContainer/pageContainer.component";
import { HttpClientModule } from '@angular/common/http';

//flux
import { AuthService } from './services/auth.service';
import { OfficeService } from './services/office.services';
import { CitasService } from './services/citas.services';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './flux/app.states';
import { AuthEffects } from './flux/effects/auth.effects';
import { OfficeEffects } from './flux/effects/offices.effects';
import { CitasEffects } from './flux/effects/citas.effects';


@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        EffectsModule.forRoot([AuthEffects,OfficeEffects,CitasEffects]),
    ],
    declarations: [
      LoadingComponent,
      PageContainerComponent,
    ],
    providers: [
      AuthService,
      OfficeService,
      CitasService
    ],
    exports: [
      LoadingComponent,
      PageContainerComponent
    ]
})
export class AppSharedModule {}
