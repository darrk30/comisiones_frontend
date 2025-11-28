import { CommonModule } from '@angular/common';
import { Component, inject, Input, input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { dtOptionsData } from 'src/app/core/helpers/dtoptions.data';
import { Archivo } from '../../data/archivo.model';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ArchivosFormModalComponent } from '../archivos-form-modal/archivos-form-modal.component';
import { ArchivosStateService } from '../../services/archivos-state.service';
import Swal from 'sweetalert2';
import { saveAs } from "file-saver";
import { ArchivoStore } from '../../services/archivo.store';

@Component({
	selector: 'app-archivos-list',
	templateUrl: './archivos-list.component.html',
	styleUrl: './archivos-list.component.css',
	standalone:true,
	imports:[DataTablesModule,BsDropdownModule,CommonModule,ModalModule,ArchivosFormModalComponent],
})
export class ArchivosListComponent {
	private modalService = inject(BsModalService);
	private spinner = inject(NgxSpinnerService);
	private router = inject(Router);
	public archivosStateService = inject(ArchivosStateService);
	public archivoStore = inject(ArchivoStore);

	// @Input() ideEquipoTrabajo: number;
	@Input() ideTabla: number;
	@Input() txtTabla: string;
	@Input() flagAction:number;



	modalRef?: BsModalRef;
	@ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
	dtTrigger: Subject<void> = new Subject<any>();
	dtOptions: DataTables.Settings = {};

	archivo:Archivo;

	tituloModal: string;
	flagAccion:number;

	ngOnInit(): void {
		this.dtOptions = dtOptionsData;
		this.archivosStateService.clearState();
		this.listar();
	}

	listar(){
		// this.archivosStateService.loadItemsByEquipoTrabajo(this.ideEquipoTrabajo).subscribe(() => {
		// 	this.rerender();
		// });
    this.archivosStateService.loadItemsByEquipoTrabajo(this.ideTabla).subscribe(() => {
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
		this.tituloModal = 'Registrar Archivo';
		let archivo:Archivo = {
			// ideTabla: this.ideEquipoTrabajo,
			ideTabla: this.ideTabla,
      // txtTabla: 'TMC_EQUIPO_TRABAJO'
      txtTabla: this.txtTabla
		};
		this.archivo = archivo;
		this.flagAccion = 1;
		this.modalRef = this.modalService.show(modal, { class: 'md', backdrop: 'static', keyboard: false });
    console.log('archivo: ',archivo);

	}

	editar(modal:any,archivo:Archivo){
		this.tituloModal = 'Editar Archivo';
		this.archivo = archivo;
		this.flagAccion = 2;
		this.modalRef = this.modalService.show(modal, { class: 'md', backdrop: 'static', keyboard: false });
	}

	ver(modal:any,archivo:Archivo){
		this.tituloModal = 'Ver Archivo';
		this.archivo = archivo;
		this.flagAccion = 3;
		this.modalRef = this.modalService.show(modal, { class: 'md', backdrop: 'static', keyboard: false });
	}

	eliminar(ideArchivo:number){
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
				this.archivosStateService.deleteItem(ideArchivo).subscribe(() => {
					this.listar();
				});
			}
		});
	}

 	descargar(archivo: Archivo) {
		const uuid = archivo.uuid;
		this.archivoStore.descargar(uuid).subscribe({
			next: (blob) => {
				saveAs(blob, `${uuid}.pdf`);
			},
			error: (error) => {
				console.error('Error al descargar el PDF', error);
			}
		});
	}

  descargarById(archivo: Archivo) {
		const id = archivo.ideArchivo;
		this.archivoStore.descargarById(id).subscribe({
			next: (blob) => {
				saveAs(blob, `${archivo.uuid}.pdf`);
			},
			error: (error) => {
				console.error('Error al descargar el PDF', error);
			}
		});
	}
}
