import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { dtOptionsData } from '@/app/core/helpers/dtoptions.data';
import { AccionesAcuerdoFormModalComponent } from '../revisiones-form-modal/acciones-acuerdo-form-modal.component';
import { EquiposTrabajoStateService } from '../../../comisiones/services/equipos-trabajo-state.service';
import { Acuerdo, AcuerdosFiltro } from '../../../acuerdos/data/acuerdo.model';
import { PagetitleComponent } from '@/app/shared/components/pagetitle/pagetitle.component';
import { ReunionesStateService } from '../../../reuniones/services/reuniones-state.service';
import { EstadosTiempoStateService } from '@/app/features/private/maintenance/estados-tiempo/services/estados-tiempo-state.service';
import { AcuerdosStateService } from '../../../acuerdos/services/acuerdos-state.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AccionesAcuerdoStateService } from '../../services/acciones-acuerdo-state.service';

@Component({
  selector: "app-revisiones-list",
  standalone: true,
  imports: [
    DataTablesModule,
    BsDropdownModule,
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    AccionesAcuerdoFormModalComponent,
    PagetitleComponent,
  ],
  templateUrl: "./acciones-acuerdo-list.component.html",
  styleUrl: "./acciones-acuerdo-list.component.css",
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccionesAcuerdoListComponent {
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private modalService = inject(BsModalService);
  private toastr = inject(ToastrService);

  public equiposTrabajoStateService = inject(EquiposTrabajoStateService);
  public reunionesStateService = inject(ReunionesStateService);
  public estadosTiempoStateService = inject(EstadosTiempoStateService);
  public acuerdosStateService = inject(AcuerdosStateService);
  public accionesAcuerdoStateService = inject(AccionesAcuerdoStateService);

  modalRef?: BsModalRef;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtTrigger: Subject<void> = new Subject<any>();
  dtOptions: DataTables.Settings = {};

  originalAcuerdos: Acuerdo[] = [];
  acuerdosFiltrados: Acuerdo[] = [];
  breadCrumbItems: Array<{}>;

  formData: FormGroup = this.formBuilder.group({
    ideEquipoTrabajo: [""],
    ideReunion: [null],
    txtTemaReunion: [""],
    ideEstadoTiempo: [""],
  });

  ideEquipoTrabajo: number;
  acuerdo: Acuerdo;

  tituloModal: string;
  // flagAccion: number;
  flagAction: number;
  submitted = false;

  filtros: AcuerdosFiltro;

  constructor() {
    this.formData.get("ideEquipoTrabajo")?.valueChanges.subscribe((v) => {
      if (!v || v == null) return;
      console.log("ideEquipoTrabajo:", v);
      this.listarActasPorEquipoTrabajo(v);
    });
  }

  listarActasPorEquipoTrabajo(ideEquipoTrabajo: number) {
    console.log("eligio et: ", ideEquipoTrabajo);
    this.reunionesStateService.loadItemsByEquipoTrabajo(ideEquipoTrabajo);
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Lista de Acuerdos" },
      { label: "Acuerdos", active: true },
    ];
    this.dtOptions = dtOptionsData;
    this.equiposTrabajoStateService.clearState();
    // this.listar();
    this.listarEquiposTrabajo();
    this.listarEstadosTiempo();
  }

  listar() {
    this.spinner.show();
    // this.reunionesStateService.loadItems().subscribe(() => {
    //   this.originalReuniones = this.reunionesStateService.items();
    //   this.reunionesFiltrados = [...this.originalReuniones];
    //   // this.aniosSuscripcion = Array.from(
    //   // 	new Set(
    //   // 		this.originalEquiposTrabajo
    //   // 			.filter(c => c.fecSuscripcion) // evita nulos
    //   // 			.map(c => new Date(c.fecSuscripcion!).getFullYear())
    //   // 	)
    //   // ).sort((a, b) => b - a);
    //   this.rerender();
    //   this.spinner.hide();
    // });
  }

  listarEquiposTrabajo() {
    this.equiposTrabajoStateService.loadItems();
  }

  listarEstadosTiempo() {
    // estados
    this.estadosTiempoStateService.loadItems();
  }

  crear(modal: any, acuerdo: any) {
    this.tituloModal = "Registrar Accion";
    this.acuerdo = acuerdo;
    this.flagAction = 1;
    this.modalRef = this.modalService.show(modal, {
      class: "md modal-lg",
      backdrop: "static",
      keyboard: false,
    });
  }

  editar(modal: any, acuerdo: any) {
    this.tituloModal = "Editar Accion";
    this.flagAction = 2;
    this.modalRef = this.modalService.show(modal, {
      class: "md modal-lg",
      backdrop: "static",
      keyboard: false,
    });
    this.acuerdo = acuerdo;
    // this.idxCurrent = idx
  }

  notificar(acuerdo: Acuerdo) {
    Swal.fire({
      title: "¿Estás seguro de enviar notificacion?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#f46a6a",
      confirmButtonText: "Si, Notificar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        //obtener acuerdoAccion, luego eliminar
        console.log(acuerdo);

        this.acuerdosStateService
          .notificarItem(acuerdo.ideAcuerdo)
          .subscribe(() => {
            // this.toastr.success('Notificacion realizada satisfactoriamente')
            // this.listar();

          });
      }
    });
  }

  eliminar(acuerdo: Acuerdo) {
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

        this.accionesAcuerdoStateService
          .deleteItemByAcuerdo(acuerdo.ideAcuerdo)
          .subscribe({
            next: (acuerdoActualizado) => {
              console.log(acuerdoActualizado);

              const index = this.acuerdosFiltrados.findIndex(
                (x) => x.ideAcuerdo === acuerdoActualizado.dato.ideAcuerdo
              );

              if (index !== -1) {
                this.acuerdosFiltrados[index].estadoAtencion = "Pendiente";
                this.acuerdosFiltrados[index].estadoTiempo.ideEstadoTiempo =
                  acuerdoActualizado.dato.estadoTiempo.ideEstadoTiempo;
              }
            },
            error: () => {
              this.toastr.error("Error al eliminar la Acción del Acuerdo");
            },
          });
      }
    });
  }

  onAccionRegistrada(event: any) {
    console.log(event);

    const index = this.acuerdosFiltrados.findIndex(
      (x) => x.ideAcuerdo === event.ideAcuerdo
    );

    if (index !== -1) {
      this.acuerdosFiltrados[index].estadoAtencion = 'Atendido';
      this.acuerdosFiltrados[index].estadoTiempo.ideEstadoTiempo = event.ideEstadoTiempo;
    }

    //Si usas DataTables
    // this.dtTrigger.next();
  }

  onAccionEliminar(event: any) {
    console.log(event);

    const index = this.acuerdosFiltrados.findIndex(
      (x) => x.ideAcuerdo === event.ideAcuerdo
    );

    if (index !== -1) {
      this.acuerdosFiltrados[index].estadoAtencion = 'Atendido';
      this.acuerdosFiltrados[index].estadoTiempo.ideEstadoTiempo = event.ideEstadoTiempo;
    }

    //Si usas DataTables
    // this.dtTrigger.next();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        // this.dtTrigger.next(null);
        setTimeout(() => {
          this.dtTrigger.next(null);
        }, 0);
      });
    } else {
      // Si es la primera vez (o si dtElement no está disponible por alguna razón),
      // solo emitir el trigger.
      setTimeout(() => {
        this.dtTrigger.next(null);
      }, 0);
    }
  }

  buscar() {
    if (!this.formData.get("ideEquipoTrabajo").value) {
      this.toastr.error("Seleccione un Equipo de Trabajo");
      return;
    }

    this.spinner.show();

    // if (!this.filtros) {
    this.filtros = {
      ideEquipoTrabajo: this.formData.get("ideEquipoTrabajo")!.value,
      ideReunion: this.formData.get("ideReunion")?.value,
      txtTemaReunion: this.formData.get("txtTemaReunion")?.value,
      ideEstadoTiempo: this.formData.get("ideEstadoTiempo")?.value,
    };
    // }

    this.acuerdosStateService.setFiltros(this.filtros);

    this.acuerdosStateService
      .loadItemsByFilter(
        this.formData.get("ideEquipoTrabajo").value,
        this.formData.get("ideReunion").value,
        this.formData.get("txtTemaReunion").value,
        this.formData.get("ideEstadoTiempo").value
      )
      // .loadItemsByFilter(
      //   this.filtros.ideEquipoTrabajo,
      //   this.filtros.ideReunion,
      //   this.filtros.txtTemaReunion,
      //   this.filtros.ideEquipoTrabajo
      // )
      .subscribe(() => {
        this.originalAcuerdos = this.acuerdosStateService.items();
        this.acuerdosFiltrados = [...this.originalAcuerdos];
        // this.aniosSuscripcion = Array.from(
        // 	new Set(
        // 		this.originalEquiposTrabajo
        // 			.filter(c => c.fecSuscripcion) // evita nulos
        // 			.map(c => new Date(c.fecSuscripcion!).getFullYear())
        // 	)
        // ).sort((a, b) => b - a);
        console.log("this.acuerdosFiltrados: ", this.acuerdosFiltrados);

        this.rerender();
        this.spinner.hide();
      });
  }
}
