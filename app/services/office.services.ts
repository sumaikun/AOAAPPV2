import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class OfficeService {
    private BASE_URL = 'https://sac.aoacolombia.com:8443/aoaapi';

    constructor(private http: HttpClient) { }

    getOffices() {
        const url = `${this.BASE_URL}/getOffices`;
        return this.http.get<any>(url);
    }

    getBranchOffices(id: number) {
        const url = `${this.BASE_URL}/getOffices/${id}`;
        return this.http.get<any>(url);
    }


}
