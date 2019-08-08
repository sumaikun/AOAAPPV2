import { Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { alert, prompt, confirm } from "tns-core-modules/ui/dialogs";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent {

  constructor(
      private router: RouterExtensions,
  ) { }

  goTo(url): void {
    console.log("Go to citas");
    this.router.navigateByUrl(url);
    const sideDrawer = <RadSideDrawer>app.getRootView();
		sideDrawer.closeDrawer();
  }

  signOut(): void{
    let self = this;
    console.log("Cerrar sesión");
    confirm({ title:"",
      message:"¿ Desea cerrar la sesión ? ",
      okButtonText: "Si",
      cancelButtonText: "No"}).then(function (result) {

        if(result)
        {
          self.router.navigateByUrl('/login');
          const sideDrawer = <RadSideDrawer>app.getRootView();
      		sideDrawer.closeDrawer();
        }

    });

  }

}
