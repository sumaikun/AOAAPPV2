import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { properties } from '../properties';

//import { User } from '../models/user';


@Injectable()
export class AppService {

    private BASE_URL = properties.getInstance().getAppUrl();
    private httpOptions;

    constructor(private http: HttpClient) { 
        this.httpOptions = { }  
    }

    validateHeaders(){        
        
        //console.log("check app token "+properties.getInstance().getAppToken());
        
        if(properties.getInstance().getAppToken())
        {
            this.httpOptions = { headers: new HttpHeaders({"access-token":properties.getInstance().getAppToken()}) }
        }                
        
    } 


    createEvent(data:any) {   
        this.validateHeaders()     
        const url = `${this.BASE_URL}/createEvent`; 
        return this.http.post<any>(url, data, this.httpOptions);
    }
    
    getActiveEvents(data:any) {   
        this.validateHeaders()     
        const url = `${this.BASE_URL}/pendingEvents`; 
        return this.http.post<any>(url, { id:data }, this.httpOptions);
    }

    closeEvent(data:any) {   
        this.validateHeaders()     
        const url = `${this.BASE_URL}/closeEvent`; 
        return this.http.post<any>(url, data, this.httpOptions);
    }


}


//example  custom timeout
// http.get('/your/url/here', { headers: new HttpHeaders({ timeout: `${20000}` }) });