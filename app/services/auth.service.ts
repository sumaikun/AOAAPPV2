import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { User } from '../models/user';


@Injectable()
export class AuthService {
    private BASE_URL = 'https://sac.aoacolombia.com:8443/aoaapi';

    constructor(private http: HttpClient) { }

    logIn(username: string, password: string) {

        console.log("username "+username);
        console.log("password "+password);

        const url = `${this.BASE_URL}/login/app`;
        return this.http.post<any>(url, { username, password });
    }


}
