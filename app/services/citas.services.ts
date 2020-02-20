import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { properties } from '../properties';

@Injectable()
export class CitasService {
    private BASE_URL = properties.getInstance().getAppUrl();;
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

    getDeliverAppointments(office: string, date: string) {
        this.validateHeaders()
        //console.log("http options",this.httpOptions)
        const url = `${this.BASE_URL}/getAppointmentsDeliver/${office}/${date}`;
        //const url = `${this.BASE_URL}/getAppPreparedAppointmentsDeliver/1/${date}`;
        console.log(url);
        return this.http.get<any[]>(url,this.httpOptions);
    }

    getDevolutionAppointments(office: string, date: string) {
        this.validateHeaders()
        const url = `${this.BASE_URL}/getAppointmentsDevol/${office}/${date}`;
        //const url = `${this.BASE_URL}/getAppPreparedAppointmentsDevol/1/${date}`;
        console.log(url);
        return this.http.get<any[]>(url,this.httpOptions);
    }

    getAppointmentsSiniesterInfo(idAppointment: number){
      this.validateHeaders()
      //console.log("http options",this.httpOptions)
      const url = `${this.BASE_URL}/getAppointmentSiniesterInfo/${idAppointment}`;
      //const url = `${this.BASE_URL}/getAppPreparedAppointmentsDevol/1/${date}`;
      console.log(url);
      return this.http.get<any[]>(url,this.httpOptions);
    }

}
