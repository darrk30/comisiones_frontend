import { Component, effect, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgStepperModule } from "angular-ng-stepper";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { limpiarCamposVacios, transformFormData } from '@/app/core/helpers/clean-form';
import { fechasValidator } from '../../../comisiones/validator/fechas.validator';
import { PagetitleComponent } from '@/app/shared/components/pagetitle/pagetitle.component';
import { PuntosAgendaListComponent } from "../../../puntos-agenda/components/puntos-agenda-list/puntos-agenda-list.component";
import { AcuerdosListComponent } from '../../../acuerdos/components/acuerdos-list/acuerdos-list.component';
import { ParticipantesListComponent } from "../../../participantes/components/participantes-list/participantes-list.component";
import { TiposSesionStateService } from '@/app/features/private/maintenance/tipos-sesion/services/tipos-sesion-state.service';
import { ReunionesStateService } from '../../services/reuniones-state.service';
import { Reunion } from '../../data/reunion.model';
import { ArchivosListComponent } from '../../../archivos/components/archivos-list/archivos-list.component';
import { PuntoAgenda } from '../../../puntos-agenda/data/punto-agenda.model';
import { ReunionStore } from '../../services/reunion-store';
import { saveAs } from "file-saver";

@Component({
  selector: "app-reuniones-form",
  templateUrl: "./reuniones-form.component.html",
  styleUrl: "./reuniones-form.component.css",
  standalone: true,
  imports: [
    CommonModule,PagetitleComponent,NgStepperModule,CdkStepperModule,FormsModule,BsDropdownModule,ReactiveFormsModule,
    PuntosAgendaListComponent,
    AcuerdosListComponent,
    ParticipantesListComponent,
    ArchivosListComponent
],
})
export class ReunionesFormComponent {

  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  readonly txtTabla: string = 'TMD_REUNION'

  public tiposSesionStateService = inject(TiposSesionStateService)
  public reunionesStateService = inject(ReunionesStateService)
  public reunionStore = inject(ReunionStore);

  breadCrumbItems: Array<{}>;

  formData: FormGroup = this.formBuilder.group({
    ideReunion: [0],
    ideEquipoTrabajo: [],
    ideTipoSesion: [null, Validators.required],
    fecReunion: [null, Validators.required],
    txtCodigoActaReunion: [],
    txtAnio: [],
    txtTemaReunion: ['', Validators.required],
    // participantes: this.formBuilder.array([]),
    participantes: [],
    puntosAgenda: [],
    acuerdos: [],
    tareas: [],
  },{
      validators: fechasValidator
  });

  participantes: any[] = [];
  puntosAgenda: PuntoAgenda[] = [];
  acuerdos: any[] = [];
  tareas: any[] = [];

  submitted = false;
  fileError: boolean = false;
  selectedFileName: string | null = null;

  ideEquipoTrabajo: number

  ideReunion: number;
  titleComponent: string;
  flagAction: number;
  idePagina: number;

  constructor() {
    this.route.data.subscribe((data) => {
      this.titleComponent = data.title;
      this.flagAction = data.flagAction;
    });

    this.ideReunion = Number(this.route.snapshot.paramMap.get("id"));

    if (this.flagAction == 1) {
      this.ideEquipoTrabajo = Number(this.route.snapshot.paramMap.get("idet"));
    } else if (this.flagAction == 2 || this.flagAction == 3) {
      effect(() => {
        const item = this.reunionesStateService.item();
        // console.log("edit-item: ", item);

        if (item) {
          this.ideEquipoTrabajo = item.ideEquipoTrabajo;
          this.formData.patchValue(item);
          console.log("form-ini: ", this.formData.value);

          this.puntosAgenda = [];
          this.puntosAgenda = item.agendas;
          this.participantes = [];
          this.participantes = item.integrantes;

          this.acuerdos = [];
          this.acuerdos = item.acuerdos.filter((item) => !item.flgTarea);
          this.tareas = [];
          this.tareas = item.acuerdos.filter((item) => item.flgTarea);
        }
      });
    }

  }

  ngOnInit(): void {
    console.log("flagAction: ", this.flagAction);
    this.breadCrumbItems = [{ label: this.titleComponent }];
		this.reunionesStateService.clearState();
		this.listarTiposSesion();

    this.getReunion();

    if (this.flagAction == 1) {
      // Modo CREAR
      this.formData.get("archivo")?.addValidators(Validators.required);
      this.idePagina = 5;
    } else if (this.flagAction == 2) {
      this.idePagina = 5;
    } else if (this.flagAction == 3) {
      // Modo CREAR
      this.formData.disable();
      this.idePagina = 7;
    }
  }

  grabar() {

    const raw = this.formData.getRawValue();
    const limpio = limpiarCamposVacios(raw);
    console.log('raw: ',raw);

    if (this.formData.valid) {

      const acuerdosTareas = [].concat(this.acuerdos, this.tareas)

      const ReunionRequest: Reunion = {
        ideReunion: this.formData.get('ideReunion').value,
        ideEquipoTrabajo: this.ideEquipoTrabajo, //
        ideTipoSesion: this.formData.get('ideTipoSesion').value,
        fecReunion: this.formData.get('fecReunion').value,
        txtCodigoActaReunion: this.formData.get('txtCodigoActaReunion').value,
        txtAnio: this.formData.get('txtAnio').value, //checar
        txtTemaReunion: this.formData.get('txtTemaReunion').value,
        acuerdos: acuerdosTareas,
        integrantes: this.participantes,
        agendas: this.puntosAgenda
      }

      console.log('ReunionRequest: ',ReunionRequest);
      this.reunionesStateService.postForm(ReunionRequest,this.formData.get("ideReunion").value);

    }

    this.submitted = true;
  }

  descargarActa() {
    const id = this.formData.get('ideReunion').value;
    this.reunionStore.descargarById(id).subscribe({
      next: (blob) => {
        saveAs(blob, `${this.formData.get('txtCodigoActaReunion').value}.pdf`);
      },
      error: (error) => {
        console.error('Error al descargar el PDF', error);
      }
    });
  }

  onParticipantesChange(lista: any[]) {
    this.participantes = lista;
    console.log("participantes actualizada desde hijo:", this.participantes);
  }

  onPuntosAgendaChange(lista: any[]) {
    this.puntosAgenda = lista;
    console.log("puntosAgenda actualizada desde hijo:", this.puntosAgenda);
  }

  onAcuerdosChange(lista: any[]) {
    this.acuerdos = lista;
    console.log("acuerdos actualizada desde hijo:", this.acuerdos);
  }

  onTareasChange(lista: any[]) {
    this.tareas = lista;
    console.log("tareas actualizada desde hijo:", this.tareas);
  }

  getReunion(){
		if(!this.ideReunion) return;
		this.reunionesStateService.loadItemById(this.ideReunion);
  }

  listarTiposSesion(){
		this.tiposSesionStateService.loadItems();
  }

}
