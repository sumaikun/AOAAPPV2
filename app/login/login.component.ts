import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { Login } from '../models/Login';
import { AppState, selectAppState, selectAuthState } from '../flux/app.states';
import { LogIn } from '../flux/actions/auth.actions';
import { IsFetching } from '../flux/actions/app.actions';
import { Store } from '@ngrx/store';
import { formValidation } from "../helpers/formValidation";
import { Observable } from 'rxjs/Observable';
import { RouterExtensions } from "nativescript-angular/router";


@Component({
	selector: "Login",
	moduleId: module.id,
	templateUrl: "./login.component.html",
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	login: Login = new Login();
	getState: Observable<any>;
	userState: Observable<any>;
    isFetching: boolean | null;


	makeLogin(): void {

		if (formValidation.validateFields(this.login, [{
			field: "username",
			validation: "NOT_EMPTY",
			title: "Usuario",
		},
		{
			field: "password",
			validation: "NOT_EMPTY",
			title: "Contraseña",
		}
		])) {
			this.store.dispatch(new IsFetching(true));
			this.store.dispatch(new LogIn(this.login));
		}

	}


	constructor(private page: Page, private store: Store<AppState>,
		private router: RouterExtensions) {
		this.getState = this.store.select(selectAppState);
		
		//console.log(JSON.parse(localStorage.getItem('auth')));

		/*let storage = JSON.parse(localStorage.getItem('auth'));
		
		if(storage)
		{
			console.log("in storage");
			if( storage.userData != null)
			{
				//pass login
				this.router.navigateByUrl('/home');
			}	
		}*/
			
		//console.log(localStorage.getItem('auth'));

	

	}

	ngOnInit(): void {

		this.page.actionBarHidden = true;

		this.getState.subscribe((state) =>
		{			
			//console.log("any");
			this.isFetching = state.isFetching;
		});

		
	}
}
