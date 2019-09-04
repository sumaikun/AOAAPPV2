import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { takePicture, requestPermissions } from 'nativescript-camera';
import { ImageAsset } from 'tns-core-modules/image-asset';
import {ImageSource, fromFile, fromAsset, fromResource, fromBase64} from "tns-core-modules/image-source";

@Component({
	selector: "Carphotos",
	moduleId: module.id,
	templateUrl: "./carPhotos.component.html",
	styleUrls: ['./carPhotos.component.css']
})
export class CarphotosComponent implements OnInit {

	saveToGallery: boolean = true;
	frontCameraImage: ImageAsset;
	leftCameraImage: ImageAsset;
	rightCameraImage: ImageAsset;
	backCameraImage: ImageAsset;

	constructor(private page: Page) {
	}

	ngOnInit(): void {
		this.page.actionBarHidden = true;
	}



    onTakePictureTap(args,imageIndex) {
        requestPermissions().then(
            () => this.capture(imageIndex),
            () => alert('permisos rechazados')
        );
    }

    capture(imageIndex) {
        takePicture({ width: 250, height: 300, keepAspectRatio: true, saveToGallery: this.saveToGallery })
            .then((imageAsset: any) => {
                this["imageIndex"] = imageAsset;
								console.log(imageAsset);

								fromAsset(imageAsset).then(res => {
											console.log(res);
			                let base64 = res.toBase64String("jpeg", 100);
											
		            });

            }, (error) => {
                console.log("Error: " + error);
            });
    }
}
