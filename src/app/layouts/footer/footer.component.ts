import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/core/services/global.service';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss'],
	standalone:true,
	imports:[]
})

/**
 * Footer component
 */
export class FooterComponent implements OnInit {

	// set the currenr year
	year: number = new Date().getFullYear();
	nombreCortoSistema: string;

	constructor(
		private globalService: GlobalService
	) {
		this.nombreCortoSistema = this.globalService.getNombreCortoSistema();
	}

	ngOnInit() {
	}

}
