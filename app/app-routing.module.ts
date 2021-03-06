import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

//components
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { CitasComponent } from "./citas/citas.component";
import { CarphotosComponent } from "./carPhotos/carPhotos.component";
import { WatchpicComponent } from "./watchPic/watchPic.component";
import { SurveysComponent } from "./surveys/surveys.component";
import { ListViewPickerComponent } from "./listViewPicker/listViewPicker.component"

//app singleton
import { properties } from './properties';


console.log(JSON.parse(localStorage.getItem('auth')))

const AuthState = JSON.parse(localStorage.getItem('auth'))

if(AuthState && AuthState.isAuthenticated)
{
  properties.setToken(AuthState.userData.token)
}

const routes: Routes = [
  { path: "", redirectTo: AuthState && AuthState.isAuthenticated ?  'home':'login', pathMatch: 'full' },
  { path: 'watchPic/:picture', component: WatchpicComponent },
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "citas", component: CitasComponent },
  { path: "fotos/:mode/:appointment/:isDelivery", component: CarphotosComponent },
  { path: "surveys/:mode/:appointment", component: SurveysComponent },
  { path: "listPicker/:mode/:items", component: ListViewPickerComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
