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
import { EquiposTrabajoStateService } from '../../../comisiones/services/equipos-trabajo-state.service';
import { ReunionesStateService } from '../../services/reuniones-state.service';
import { Reunion } from '../../data/reunion.model';
import Swal from 'sweetalert2';

@Component({
  selector: "app-reuniones-list",
  standalone: true,
  imports: [
    DataTablesModule,BsDropdownModule,CommonModule,NgSelectModule,FormsModule,ReactiveFormsModule,
  ],
  templateUrl: "./reuniones-list.component.html",
  styleUrl: "./reuniones-list.component.css",
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReunionesListComponent {
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  public equiposTrabajoStateService = inject(EquiposTrabajoStateService);
  public reunionesStateService = inject(ReunionesStateService);

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtTrigger: Subject<void> = new Subject<any>();
  dtOptions: DataTables.Settings = {};

  originalReuniones: Reunion[] = [];
  reunionesFiltrados: Reunion[] = [];
  breadCrumbItems: Array<{}>;
  // aniosSuscripcion:any;

  formData: FormGroup = this.formBuilder.group({
    ideEquipoTrabajo: [""],
  });

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Lista de comisiones" },
      { label: "comisiones", active: true },
    ];
    this.dtOptions = dtOptionsData;
    this.equiposTrabajoStateService.clearState();
    // this.listar();
    // this.listarEquiposTrabajo();
    // this.listarMotivosEquipoTrabajo()
  }

  listar(){
		this.spinner.show();
		this.reunionesStateService.loadItems().subscribe(() => {
			this.originalReuniones = this.reunionesStateService.items();
			this.reunionesFiltrados = [...this.originalReuniones];
			// this.aniosSuscripcion = Array.from(
			// 	new Set(
			// 		this.originalEquiposTrabajo
			// 			.filter(c => c.fecSuscripcion) // evita nulos
			// 			.map(c => new Date(c.fecSuscripcion!).getFullYear())
			// 	)
			// ).sort((a, b) => b - a);
			this.rerender();
			this.spinner.hide();
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
    if (this.dtElement == undefined) return;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  agregar() {
    this.router.navigate([`negocio/reunion/crear`]);
  }

  editar(reunion: Reunion) {
    this.router.navigate([`negocio/reunion/editar/${reunion.ideReunion}`,
    ]);
  }

    eliminar(ideReunion:number){
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
          this.reunionesStateService.deleteItem(ideReunion).subscribe(() => {
            this.listar();
          });
        }
      });
    }

}
