import { Component, OnInit, Input } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";

@Component({
	selector: "PageContainer",
	moduleId: module.id,
	templateUrl: "./pageContainer.component.html",
	styleUrls: ['./pageContainer.component.css']
})
export class PageContainerComponent implements OnInit {

	@Input() pageTitle: string;

	constructor(private page: Page) {

	}

	ngOnInit(): void {
	}

	onDrawerButtonTap(): void {
		const sideDrawer = <RadSideDrawer>app.getRootView();
		sideDrawer.showDrawer();
	}
}