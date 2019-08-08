import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";

@Component({
	selector: "Carphotos",
	moduleId: module.id,
	templateUrl: "./carPhotos.component.html",
	styleUrls: ['./carPhotos.component.css']
})
export class CarphotosComponent implements OnInit {

	constructor(private page: Page) {
	}

	ngOnInit(): void {
		this.page.actionBarHidden = true;
	}
}