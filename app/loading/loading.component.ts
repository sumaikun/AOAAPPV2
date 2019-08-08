import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";

@Component({
	selector: "Loading",
	moduleId: module.id,
	templateUrl: "./loading.component.html",
	styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

	constructor(private page: Page) {
	}

	ngOnInit(): void {
		this.page.actionBarHidden = true;
	}
}