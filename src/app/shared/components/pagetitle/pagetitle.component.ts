import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-title',
  templateUrl: './pagetitle.component.html',
  styleUrls: ['./pagetitle.component.scss'],
  standalone:true,
  imports:[CommonModule]
})
export class PagetitleComponent implements OnInit {
	private router = inject(Router);

	@Input() breadcrumbItems;
	@Input() title: string;
	@Input() flgBotonRegresar: boolean = false;
	@Input() idePagina:number;

	constructor() { }

	ngOnInit() {

	}

	regresar(){
		if(this.idePagina == 1){
			this.router.navigate([`negocio/comision`]);
		}else if(this.idePagina == 5){
			this.router.navigate([`negocio/reunion`]);
		}else if(this.idePagina == 3){
			this.router.navigate([`reporte/comision`]);
		}else if(this.idePagina == 7){
			this.router.navigate([`negocio/reunion`]);
		}else if(this.idePagina == 4){
			this.router.navigate([`mantenimiento/institucion`]);
		}else{
			this.router.navigate([`dashboard`]);
		}

	}

}
