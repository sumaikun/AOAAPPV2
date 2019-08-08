import { SearchBar } from "tns-core-modules/ui/search-bar";
import { Component, OnInit } from "@angular/core";

@Component({
	selector: "Platefiltermodal",
	moduleId: module.id,
	templateUrl: "./plateFilterModal.component.html",
	styleUrls: ['./plateFilterModal.component.css']
})
export class PlatefiltermodalComponent implements OnInit {
    searchPhrase: string;
    onSearchSubmit(args): void {
        let searchBar = <SearchBar>args.object;
        console.log("You are searching for " + searchBar.text);
    }


	constructor() {
	}

	ngOnInit(): void {
	}
}