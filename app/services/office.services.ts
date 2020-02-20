import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { properties } from '../properties';

@Injectable()
export class OfficeService {
    private BASE_URL = properties.getInstance().getAppUrl();
    private httpOptions; 


    constructor(private http: HttpClient){
        
        this.httpOptions = {
            headers: new HttpHeaders()
        };
        
        this.httpOptions.headers.set("access-token",properties.getInstance().getAppToken());
     }

    getOffices() {
        const url = `${this.BASE_URL}/getOffices`;
        console.log(this.httpOptions.headers);
        return this.http.get<any[]>(url,this.httpOptions);
    }

    getBranchOffices(id: number) {
        const url = `${this.BASE_URL}/getOffices/${id}`;
        return this.http.get<any[]>(url,this.httpOptions);
    }


}
