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
import { ToastrService } from 'ngx-toastr';
import { ReunionStore } from '../../services/reunion-store';
import { saveAs } from "file-saver";

@Component({
  selector: "app-reuniones-list",
  standalone: true,
  imports: [
    DataTablesModule,
    BsDropdownModule,
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./reuniones-list.component.html",
  styleUrl: "./reuniones-list.component.css",
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReunionesListComponent {
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private toastr = inject(ToastrService);

  public equiposTrabajoStateService = inject(EquiposTrabajoStateService);
  public reunionesStateService = inject(ReunionesStateService);
  public reunionStore = inject(ReunionStore);

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtTrigger: Subject<void> = new Subject<any>();
  dtOptions: DataTables.Settings = {};

  originalReuniones: Reunion[] = [];
  reunionesFiltrados: Reunion[] = [];
  breadCrumbItems: Array<{}>;

  formData: FormGroup = this.formBuilder.group({
    ideEquipoTrabajo: [""],
  });

  ideEquipoTrabajo: number;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Lista de comisiones" },
      { label: "comisiones", active: true },
    ];
    this.dtOptions = dtOptionsData;
    this.equiposTrabajoStateService.clearState();
    this.listar();
    this.listarEquiposTrabajo();
  }

  listar() {
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

  listarEquiposTrabajo() {
    this.equiposTrabajoStateService.loadItems();
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
    this.ideEquipoTrabajo = this.formData.get("ideEquipoTrabajo").value;
    console.log("ideEquipoTrabajo: ", this.ideEquipoTrabajo);

    if (!this.ideEquipoTrabajo) {
      this.toastr.error("Seleccione un Equipo de Trabajo");
      return;
    }
    this.router.navigate([`negocio/reunion/crear/${this.ideEquipoTrabajo}`]);
  }

  editar(reunion: Reunion) {
    this.router.navigate([`negocio/reunion/editar/${reunion.ideReunion}`]);
  }

  descargarActa(reunion: Reunion) {
    const id = reunion.ideReunion;
    this.reunionStore.descargarById(id).subscribe({
      next: (response) => {
        // console.log(response);
        const blob = response.body;
        // Capturar header Content-Disposition
        const contentDisposition = response.headers.get("Content-Disposition");
        let fileName = `ACTA-${reunion.txtCodigoActaReunion}-${reunion.txtAnio}-ITP/GTP.pdf`;
        // console.log(contentDisposition);

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match && match.length > 1) {
            fileName = match[1];
          }
        }

        saveAs(blob, fileName);
      },
      error: (error) => {
        console.error("Error al descargar el PDF", error);
      },
    });
  }

  eliminar(ideReunion: number) {
    Swal.fire({
      title: "¿Estás seguro de eliminar el registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Si, Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.reunionesStateService.deleteItem(ideReunion).subscribe(() => {
          this.listar();
        });
      }
    });
  }

  buscar() {
    this.reunionesFiltrados = this.originalReuniones.filter((c) => {
      const equiposTrabajoSeleccionado: number[] =
        this.formData.get("ideEquipoTrabajo").value;

      const coincideEquipoTrabajo =
        equiposTrabajoSeleccionado.length === 0 ||
        (c.ideEquipoTrabajo &&
          equiposTrabajoSeleccionado.includes(c.ideEquipoTrabajo));

      return coincideEquipoTrabajo;
    });

    this.rerender();
  }
}
