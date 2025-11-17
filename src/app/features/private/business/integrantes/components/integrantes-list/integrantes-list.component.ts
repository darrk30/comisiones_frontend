import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { IntegrantesFormModalComponent } from '../integrantes-form-modal/integrantes-form-modal.component';
import { Subject } from 'rxjs';
import { dtOptionsData } from '@/app/core/helpers/dtoptions.data';

@Component({
  selector: 'app-integrantes-list',
  standalone: true,
 	imports:[DataTablesModule,BsDropdownModule,CommonModule,NgSelectModule,FormsModule,ReactiveFormsModule,IntegrantesFormModalComponent],
  templateUrl: './integrantes-list.component.html',
  styleUrl: './integrantes-list.component.css'
})
export class IntegrantesListComponent implements OnInit {

	private modalService = inject(BsModalService);
	private spinner = inject(NgxSpinnerService);
	private formBuilder = inject(FormBuilder);

	modalRef?: BsModalRef;
	@ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
	dtTrigger: Subject<void> = new Subject<any>();

	dtOptions: DataTables.Settings = {};

	@Input() ideIntegrante: number;
  @Input() flagAction:number;

	tituloModal: string;
	flagAccion:number;

  ngOnInit(): void {
		this.dtOptions = dtOptionsData;

		console.log(this.flagAction)
	}


	crear(modal:any){
		this.tituloModal = 'Registrar Integrante';

		this.flagAccion = 1;
		this.modalRef = this.modalService.show(modal, { class: 'md modal-lg', backdrop: 'static', keyboard: false });
	}

  ngAfterViewInit(): void {
		this.dtTrigger.next();
	}

}
