import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

//components
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { CitasComponent } from "./citas/citas.component";
import { CarphotosComponent } from "./carPhotos/carPhotos.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "citas", component: CitasComponent },
  { path: "fotos", component: CarphotosComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
