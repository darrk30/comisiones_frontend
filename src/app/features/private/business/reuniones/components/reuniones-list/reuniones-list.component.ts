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
import { PagetitleComponent } from '@/app/shared/components/pagetitle/pagetitle.component';
import { GlobalService } from '@/app/core/services/global.service';

@Component({
  selector: "app-reuniones-list",
  standalone: true,
  imports: [
    DataTablesModule,BsDropdownModule,CommonModule,NgSelectModule,FormsModule,ReactiveFormsModule,
    PagetitleComponent
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
  public globalService = inject(GlobalService)

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtTrigger: Subject<void> = new Subject<any>();
  dtOptions: DataTables.Settings = {};

  originalReuniones: Reunion[] = [];
  reunionesFiltrados: Reunion[] = [];
  breadCrumbItems: Array<{}>;

  formData: FormGroup = this.formBuilder.group({
    ideEquipoTrabajo: [null],
  });

  ideEquipoTrabajo: number;
  currentRol: string

  ngOnInit(): void {
    this.currentRol = this.globalService.getCurrentRol()
    console.log(this.currentRol);

    this.breadCrumbItems = [
      { label: "Lista de Reuniones" },
      { label: "Reuniones", active: true },
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

  ver(reunion: Reunion) {
    this.router.navigate([`negocio/reunion/ver/${reunion.ideReunion}`]);
  }

  descargarActa(reunion: Reunion) {
    const id = reunion.ideReunion;
    this.reunionStore.descargarById(id).subscribe({
      next: (response) => {
        // console.log(response);
        const blob = response.body;
        // Capturar header Content-Disposition

        let fileName =  this.reunionStore.obtenerNombreArchivo(response.headers);

        fileName = fileName
        .replace(/^ACTA_N__/, "Acta N° ")
        .replace(/_-_/g, "-")      // _-_ → -
        .replace(/_\/_|%2F/gi, "/")// _/_ o %2F → /
        .replace(/_/g, "");        // limpia _ sobrantes

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
    // console.log(this.formData.get("ideEquipoTrabajo").value);
    const equipostrabajo = this.formData.get("ideEquipoTrabajo").value

    const equiposTrabajoSeleccionado: number[] =
        Array.isArray(equipostrabajo)?equipostrabajo : [equipostrabajo];

    if (equipostrabajo == null){
      this.reunionesFiltrados = [...this.originalReuniones];
    }else{
      this.reunionesFiltrados = this.originalReuniones.filter((c) => {
        const coincideEquipoTrabajo =
          equiposTrabajoSeleccionado.length === 0 ||
          (c.ideEquipoTrabajo &&
            equiposTrabajoSeleccionado.includes(c.ideEquipoTrabajo));

        return coincideEquipoTrabajo;
      });

    }

    this.rerender();
  }
}
