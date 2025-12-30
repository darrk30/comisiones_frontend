import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { dtOptionsData } from '@/app/core/helpers/dtoptions.data';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import { PagetitleComponent } from "@/app/shared/components/pagetitle/pagetitle.component";

import { TiposEquipoTrabajoStateService } from '@/app/features/private/maintenance/tipos-equipo-trabajo/services/tipos-equipo-trabajo-state.service';
import { MotivosEquipoTrabajoStateService } from '@/app/features/private/maintenance/motivos-equipo-trabajo/services/motivos-equipo-trabajo-state.service';
import { EstadosComisionStateService } from '@/app/features/private/maintenance/estados-comision/services/estados-comision-state.service';
import { EquiposTrabajoStateService } from '@/app/features/private/business/comisiones/services/equipos-trabajo-state.service';
import { EquipoTrabajo } from '@/app/features/private/business/comisiones/data/equipo-trabajo.model';
import { limpiarCamposVacios } from '@/app/core/helpers/clean-form';
import { saveAs } from "file-saver";
import { EquipoTrabajoStore } from '@/app/features/private/business/comisiones/services/equipos-trabajo.store';

@Component({
  selector: 'app-comisiones-list',
  templateUrl: './comisiones-report.component.html',
  styleUrl: './comisiones-report.component.css',
  standalone:true,
  imports:[DataTablesModule,BsDropdownModule,CommonModule,NgSelectModule,FormsModule,ReactiveFormsModule,PagetitleComponent],
})
export class ComisionesReportComponent  {

  private spinner = inject(NgxSpinnerService);
	private router = inject(Router);
	private formBuilder = inject(FormBuilder);

	public equipoTrabajoStateService = inject(EquiposTrabajoStateService);
  public tiposEquipoTrabajoStateService = inject(TiposEquipoTrabajoStateService)
  public motivosEquipoTrabajoStateService = inject(MotivosEquipoTrabajoStateService)
  // public estadosTrazabilidadStateService = inject(EstadosTrazabilidadStateService)
  public estadosComisionStateService = inject(EstadosComisionStateService)
  public equipoTrabajoStore = inject(EquipoTrabajoStore)

  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
	dtTrigger: Subject<void> = new Subject<any>();
	dtOptions: DataTables.Settings = {};

	originalEquiposTrabajo: EquipoTrabajo[] = [];
	equiposTrabajoFiltrados: EquipoTrabajo[] = [];
	breadCrumbItems: Array<{}>;
	aniosSuscripcion:any;

  formData: FormGroup = this.formBuilder.group({
		// ideEstadoTrazabilidad:[""],
		ideEstadoComision:[""],
		ideMotivoEquipoTrabajo:[""],
		ideTipoEquipoTrabajo:[null],
		txtEquipoTrabajo:[""]

	});


  ngOnInit():void {
		this.breadCrumbItems = [{ label: 'Lista de comisiones' }, { label: 'comisiones', active: true }];
		this.dtOptions = dtOptionsData;
		this.equipoTrabajoStateService.clearState();
	  this.listar();
    this.listarTiposEquipoTrabajo();
    this.listarMotivosEquipoTrabajo()
    this.listarEstadosComision()
  }

  listar(){
		this.spinner.show();
		this.equipoTrabajoStateService.loadItems().subscribe(() => {
			this.originalEquiposTrabajo = this.equipoTrabajoStateService.items();
			this.equiposTrabajoFiltrados = [...this.originalEquiposTrabajo];
			this.aniosSuscripcion = Array.from(
				new Set(
					this.originalEquiposTrabajo
						.filter(c => c.fecSuscripcion) // evita nulos
						.map(c => new Date(c.fecSuscripcion!).getFullYear())
				)
			).sort((a, b) => b - a);
			this.rerender();
			this.spinner.hide();
		});
	}

  listarTiposEquipoTrabajo(){
		this.tiposEquipoTrabajoStateService.loadItems();
	}

  listarMotivosEquipoTrabajo(){
		this.motivosEquipoTrabajoStateService.loadItems();
	}

  listarEstadosComision(){
		this.estadosComisionStateService.loadItems();
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

  editar(equipoTrabajo:EquipoTrabajo){
		this.router.navigate([`negocio/comision/editar/${equipoTrabajo.ideEquipoTrabajo}`]);
	}

  ver(equipoTrabajo:EquipoTrabajo){
		this.router.navigate([`negocio/comision/ver/${equipoTrabajo.ideEquipoTrabajo}`]);
	}

  eliminar(ideEquipoTrabajo:number){
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
				this.equipoTrabajoStateService.deleteItem(ideEquipoTrabajo).subscribe(() => {
					this.listar();
				});
			}
		});
	}

  buscar(){
    const searchKeywords = (this.formData.get('txtEquipoTrabajo')?.value || '').toLowerCase().trim().split(' ').filter((keyword) => keyword !== '');


    this.equiposTrabajoFiltrados = this.originalEquiposTrabajo.filter(c=>{
      // const estadoSeleccionado =+ this.formData.get('ideEstadoTrazabilidad').value
      const tiposEquipoTrabajoSeleccionado: number[] = this.formData.get('ideTipoEquipoTrabajo').value
      const motivosEquipoTrabajoSeleccionado: number[] = this.formData.get('ideMotivoEquipoTrabajo').value
      const estadosComisionSeleccionado: number[] = this.formData.get('ideEstadoComision').value

      const coincideTipoEquipoTrabajo = tiposEquipoTrabajoSeleccionado == null ||
      //tiposEquipoTrabajoSeleccionado.length === 0 ||
				c.tipoEquipoTrabajo &&
        tiposEquipoTrabajoSeleccionado == c.tipoEquipoTrabajo.ideTipoEquipoTrabajo;
        // tiposEquipoTrabajoSeleccionado.includes(c.tipoEquipoTrabajo.ideTipoEquipoTrabajo);

      const coincideMotivoEquipoTrabajo = motivosEquipoTrabajoSeleccionado.length === 0 ||
				c.motivoEquipoTrabajo &&
        // motivosEquipoTrabajoSeleccionado == c.motivoEquipoTrabajo.ideMotivoEquipoTrabajo;
        motivosEquipoTrabajoSeleccionado.includes(c.motivoEquipoTrabajo.ideMotivoEquipoTrabajo);

      const coincideEstadoComision = estadosComisionSeleccionado.length === 0 ||
				c.estadoComision && estadosComisionSeleccionado.includes(c.estadoComision.ideEstadoComision);

      // const textoCompleto = objectToText(c).toLowerCase();
      const textoCompleto = c.txtEquipoTrabajo.toLowerCase();
			const coincideBusquedaGeneral = searchKeywords.every((keyword) => textoCompleto.includes(keyword));


        return coincideBusquedaGeneral &&coincideTipoEquipoTrabajo && coincideMotivoEquipoTrabajo && coincideEstadoComision
    })

		this.rerender();

  }

  descargar(){
		const cleanFormValue = this.obtenerFormValueLimpio();
    console.log(cleanFormValue);

    this.equipoTrabajoStore.descargarExcel(cleanFormValue).subscribe({
			next: (response: Blob) => {
				const contentType = response.type;

				// Determinar la extensión del archivo basada en el tipo MIME
				let extension = '';
				switch (contentType) {
					case 'application/pdf':
					extension = '.pdf';
					break;
					case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
					extension = '.xlsx';
					break;
					case 'application/vnd.ms-excel':
					extension = '.xls';
					break;
					case 'text/plain':
					extension = '.txt';
					break;
					case 'application/zip':
					extension = '.zip';
					break;
					default:
					extension = ''; // Extensión por defecto si no se reconoce el tipo MIME
				}

				// Crear un archivo Blob a partir de la respuesta
				const blob = new Blob([response], { type: contentType });

				// Generar un nombre de archivo dinámico
				const fileName = `Comisiones.${extension}`;

				// Usar file-saver para descargar el archivo
				saveAs(blob, fileName);
      },
			error: (error) => {
				console.error('Error al descargar el PDF', error);
			}
		});
  }

   obtenerFormValueLimpio(){
		const raw = this.formData.getRawValue();
		const limpio = limpiarCamposVacios(raw);

		// if (limpio.hasOwnProperty("ideEstadoConvenio")){
		// 	limpio["ideEstadoConvenio"] = Number(limpio["ideEstadoConvenio"]);
		// }
		return limpio;
	}

}
