import { Component, OnInit } from "@angular/core";

@Component({
	selector: "Infoappointment",
	moduleId: module.id,
	templateUrl: "./infoAppointment.component.html",
	styleUrls: ['./infoAppointment.component.css']
})
export class InfoappointmentComponent implements OnInit {
    onButtonTap(): void {
        console.log("Button was pressed");
    }


	constructor() {
	}

	ngOnInit(): void {
	}
}