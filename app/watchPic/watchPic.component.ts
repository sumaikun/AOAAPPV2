import { Component, OnInit } from "@angular/core";
import { Image } from "tns-core-modules/ui/image";
import {  ActivatedRoute, Params } from '@angular/router';
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
	selector: "WatchPic",
	moduleId: module.id,
	templateUrl: "./watchPic.component.html",
	styleUrls: ['./watchPic.component.css']
})
export class WatchpicComponent implements OnInit {

  selectedImage: Image;

  constructor(private route: ActivatedRoute, private page: Page,
		private router: RouterExtensions){
  }

  ngOnInit(): void {

    console.log("component of watch pic initialized");

    this.page.actionBarHidden = true;

    this.route.params.subscribe((params: Params) => {
      console.log(params);
      this.selectedImage = params.picture;
    });
  }

	goBack(): void {
		this.router.back();
	}

}
