import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { PagetitleComponent } from "@/app/shared/components/pagetitle/pagetitle.component";
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { dtOptionsData } from '@/app/core/helpers/dtoptions.data';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-comisiones-list',
  templateUrl: './comisiones-list.component.html',
  styleUrl: './comisiones-list.component.css',
  standalone:true,
  imports:[DataTablesModule,BsDropdownModule,CommonModule,NgSelectModule,FormsModule,ReactiveFormsModule,PagetitleComponent],
})
export class ComisionesListComponent  {

  private spinner = inject(NgxSpinnerService);
	private router = inject(Router);
	private formBuilder = inject(FormBuilder);

  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
	dtTrigger: Subject<void> = new Subject<any>();

	dtOptions: DataTables.Settings = {};
	breadCrumbItems: Array<{}>;

  ngOnInit():void {
		this.breadCrumbItems = [{ label: 'Lista de comisiones' }, { label: 'comisiones', active: true }];
		this.dtOptions = dtOptionsData;

  }

  ngAfterViewInit(): void {
		this.dtTrigger.next();
	}

  ngOnDestroy(): void {
		// Do not forget to unsubscribe the event
		this.dtTrigger.unsubscribe();
	}

  rerender(): void {
		if(this.dtElement==undefined) return;
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			// Destroy the table first
			dtInstance.destroy();
			// Call the dtTrigger to rerender again
			this.dtTrigger.next();
		});
	}

  agregar(){
		this.router.navigate([`negocio/comision/crear`]);
	}
}
