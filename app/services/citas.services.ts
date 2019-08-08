import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class CitasService {
    private BASE_URL = 'https://sac.aoacolombia.com:8443/aoaapi';

    constructor(private http: HttpClient) { }

    getDeliverAppointments(office: string, date: string) {
        const url = `${this.BASE_URL}/getAppPreparedAppointmentsDeliver/${office}/${date}`;
        //const url = `${this.BASE_URL}/getAppPreparedAppointmentsDeliver/1/${date}`;
        console.log(url);
        return this.http.get<any[]>(url);
    }

    getDevolutionAppointments(office: string, date: string) {
        const url = `${this.BASE_URL}/getAppPreparedAppointmentsDevol/${office}/${date}`;
        //const url = `${this.BASE_URL}/getAppPreparedAppointmentsDevol/1/${date}`;
        console.log(url);
        return this.http.get<any[]>(url);
    }


}
