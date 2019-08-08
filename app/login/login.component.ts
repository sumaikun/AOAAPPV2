import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { Login } from '../models/Login';
import { AppState, selectAppState } from '../flux/app.states';
import { LogIn } from '../flux/actions/auth.actions';
import { IsFetching } from '../flux/actions/app.actions';
import { Store } from '@ngrx/store';
import { formValidation } from "../helpers/formValidation";
import { Observable } from 'rxjs/Observable';

@Component({
	selector: "Login",
	moduleId: module.id,
	templateUrl: "./login.component.html",
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	login: Login = new Login();
	getState: Observable<any>;
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


	constructor(private page: Page, private store: Store<AppState>) {
		this.getState = this.store.select(selectAppState);
	}

	ngOnInit(): void {

		this.page.actionBarHidden = true;

		this.getState.subscribe((state) =>
		{
				this.isFetching = state.isFetching;
		});


	}
}
