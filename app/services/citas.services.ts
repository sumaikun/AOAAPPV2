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
        
        console.log("check app token "+properties.getInstance().getAppToken());
        
        if(properties.getInstance().getAppToken())
        {
            this.httpOptions = { headers: new HttpHeaders({"access-token":properties.getInstance().getAppToken()}) }
        }                
        
    } 

    getDeliverAppointments(office: string, date: string) {
        this.validateHeaders()
        const url = `${this.BASE_URL}/getAppointmentsDeliver/${office}/${date}`;
        console.log(url);
        return this.http.get<any[]>(url,this.httpOptions);
    }

    getDevolutionAppointments(office: string, date: string) {
        this.validateHeaders()
        const url = `${this.BASE_URL}/getAppointmentsDevol/${office}/${date}`;        
        console.log(url);
        return this.http.get<any[]>(url,this.httpOptions);
    }

    getAppointmentsSiniesterInfo(idAppointment: number){
      this.validateHeaders()
      const url = `${this.BASE_URL}/getAppointmentSiniesterInfo/${idAppointment}`;      
      console.log(url);
      return this.http.get<any[]>(url,this.httpOptions);
    }


    //**  Save appointment this service is not in a effect */

    saveAppointment(data: any){
        this.validateHeaders()
        const url = `${this.BASE_URL}/proccessAppointment`;        
        console.log(url);
        return this.http.post<any[]>(url,data);
    }

    AssignInDeliver(data: any){
        this.validateHeaders()
        const url = `${this.BASE_URL}/assignOperatorDeliver`;        
        console.log(url);
        return this.http.post<any>(url,data,this.httpOptions);
    }

    AssignInDevolution(data: any){
        this.validateHeaders()
        const url = `${this.BASE_URL}/assignOperatorDevolution`;        
        console.log(url);
        return this.http.post<any>(url,data,this.httpOptions);
    }

    checkAssignInDeliver(operatorId: string, appointment: string){
        this.validateHeaders()
        const url = `${this.BASE_URL}/checkIfOperatorDeliver/${operatorId}/${appointment}`;      
        console.log(url);
        return this.http.get<any>(url,this.httpOptions);
    }

    checkAssignInDevolution(operatorId: string, appointment: string){
        this.validateHeaders()
        const url = `${this.BASE_URL}/checkIfOperatorDevolution/${operatorId}/${appointment}`;      
        console.log(url);
        return this.http.get<any>(url,this.httpOptions);
    }


    checkKilometerLimit(data: any){
        this.validateHeaders()
        const url = `${this.BASE_URL}/checkKilometers`;      
        console.log(url);
        return this.http.post<any>(url,data,this.httpOptions);
    }
}
