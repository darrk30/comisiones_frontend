import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { DemosStateService } from '../../services/demos-state.service';
import { DemoStore } from '../../services/demo.store';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Demo } from '../../data/demo.model';
import { dtOptionsData } from '@/app/core/helpers/dtoptions.data';
import Swal from 'sweetalert2';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';
import { PagetitleComponent } from '@/app/shared/components/pagetitle/pagetitle.component';
import { DemosFormModalComponent } from '../demos-form-modal/demos-form-modal.component';

@Component({
	selector: 'app-demos-list',
	templateUrl: './demos-list.component.html',
	styleUrl: './demos-list.component.css',
	standalone:true,
	imports:[DataTablesModule,BsDropdownModule,CommonModule,ModalModule, FormsModule, ReactiveFormsModule, PagetitleComponent,DemosFormModalComponent,],
})
export class DemosListComponent {
	private modalService = inject(BsModalService);
	private spinner = inject(NgxSpinnerService);
	private router = inject(Router);
	private formBuilder = inject(FormBuilder);
	public demosStateService = inject(DemosStateService);
	public demoStore = inject(DemoStore);


	modalRef?: BsModalRef;
	@ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
	dtTrigger: Subject<void> = new Subject<any>();

	dtOptions: DataTables.Settings = {};

	originalDemos: Demo[] = [];
	demosFiltrados: Demo[] = [];
	breadCrumbItems: Array<{}>;

	demo:Demo;
	tituloModal: string;
	flagAccion:number;

	formData: FormGroup = this.formBuilder.group({
		demo:[],
	});

	ngOnInit(): void {
		this.dtOptions = dtOptionsData;
		this.demosStateService.clearState();
		this.listar();
	}

	listar(){
		this.demosStateService.loadItems().subscribe(() => {
			this.originalDemos = this.demosStateService.items();
			this.demosFiltrados = [...this.originalDemos];
			this.rerender();
		});
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

	crear(modal:any){
		this.tituloModal = 'Registrar Demo';
		this.flagAccion = 1;
		this.demo = null;
		this.modalRef = this.modalService.show(modal, { class: 'md', backdrop: 'static', keyboard: false });
	}

	editar(modal:any,demo:Demo){
		this.tituloModal = 'Editar Demo';
		this.demo = demo;
		this.flagAccion = 2;
		this.modalRef = this.modalService.show(modal, { class: 'md', backdrop: 'static', keyboard: false });
	}

	ver(modal:any,demo:Demo){
		this.tituloModal = 'Ver Demo';
		this.demo = demo;
		this.flagAccion = 3;
		this.modalRef = this.modalService.show(modal, { class: 'md', backdrop: 'static', keyboard: false });
	}

	eliminar(ideDemo:number){
		Swal.fire({
			title: '¿Estás seguro de eliminar el registro?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#34c38f',
			cancelButtonColor: '#f46a6a',
			confirmButtonText: 'Si, Eliminar',
			cancelButtonText: 'Cancelar'
		}).then(result => {
			if (result.value) {
				this.spinner.show();
				this.demosStateService.deleteItem(ideDemo).subscribe(() => {
					this.listar();
				});
			}
		});
	} 

	buscar(){
		const demoSeleccionado = this.formData.get('Demo').value;

		this.demosFiltrados = this.originalDemos.filter(c => {
			
			
			const coincideDemo = !demoSeleccionado || c.demo == demoSeleccionado;

			return coincideDemo;
		});

		this.rerender();
	}
}
