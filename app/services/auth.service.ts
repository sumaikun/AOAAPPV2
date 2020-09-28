import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { properties } from '../properties';

//import { User } from '../models/user';


@Injectable()
export class AuthService {
    private BASE_URL = properties.getInstance().getAppUrl();

    constructor(private http: HttpClient) { }

    logIn(username: string, password: string) {

        //console.log("username "+username);
        //console.log("password "+password);

        const authBody = { username, password }
        

        const url = `${this.BASE_URL}/auth`;
        return this.http.post<any>(url, authBody);
    }


}
