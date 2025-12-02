import { OficinasStateService } from '@/app/features/private/maintenance/oficinas/services/oficinas-state.service';
import { PersonasStateService } from '@/app/features/private/maintenance/personas/services/personas-state.service';
import { Component, effect, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { Integrante } from '../../../integrantes/data/integrante.model';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { IntegrantesStateService } from '../../../integrantes/services/integrantes-state.service';
import { Persona } from '@/app/features/private/maintenance/personas/data/persona.model';


@Component({
  selector: "app-participantes-form-modal",
  templateUrl: "./participantes-form-modal.component.html",
  styles: "",
  standalone: true,
  imports: [
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgSelectModule,
  ],
})
export class ParticipantesFormModalComponent {
  private modalService = inject(BsModalService);
  private formBuilder = inject(FormBuilder);
  public oficinasStateService = inject(OficinasStateService);
  public personasStateService = inject(PersonasStateService);
  public integrantesStateService = inject(IntegrantesStateService);

  @Input() integrante: Integrante = null;
  @Input() flagActionLocal: number;
  @Input() flagInvitado: boolean;

  @Output() onSave = new EventEmitter<any>();
  @Output() onSaveList = new EventEmitter<any[]>();

  ideIntegrante: number | null = null;
  miembrosList: any[];

  formData: FormGroup = this.formBuilder.group({
    ideIntegrante: [0],
    ideTabla: [0], //ideReunion
    txtTabla: [''],
    ideOficina: [],
    ideColaborador: [],
    ideCargo: [],
    txtCargoComite: [],
    flgInvitado: [],
  });

  submitted = false;

  constructor() {
    this.formData.get("ideOficina")?.valueChanges.subscribe((v) => {
      if (!v || v == null) return;
      console.log("oficina:", v);
      this.listarPersonasByOficina(v);
    });
  }

  ngOnInit(): void {
    console.log("integrante: ", this.integrante);
    this.ideIntegrante = this.integrante ? this.integrante.ideIntegrante : 0;
    this.listarOficinas();

    if (this.flagActionLocal == 2 && this.flagInvitado) {
      this.formData.patchValue(this.integrante);
    }

    if (this.flagActionLocal == 3) {
      this.formData.disable();
    }

    if (!this.flagInvitado) {
      this.listarMiembros();
    }
  }

  listarMiembros() {
    this.integrantesStateService.loadItemsByEquipoTrabajo(8).subscribe(() => {
      const items = this.integrantesStateService.items();

      this.miembrosList = items.map((item) => ({
        ideIntegrante: item.ideIntegrante,
        ideTabla: item.ideTabla,
        txtTabla: item.txtTabla,
        ideOficina: item.ideOficina,
        ideColaborador: item.ideColaborador,
        ideCargo: item.ideCargo,
        txtCargoComite: item.txtCargoComite,
        persona: item.persona,
        flgInvitado: false,
        checked: false,
      }));

      console.log("miembrosList: ", this.miembrosList);
    });
  }

  grabar() {
    console.log("flagInvitado: ", this.flagInvitado);

    if (this.flagInvitado) {
      console.log("save-data: ", this.formData.value);
      console.log("ideIntegrante :", this.ideIntegrante);
      if (this.formData.invalid) return;

      this.onSave.emit({
        ...this.formData.value,
        ideIntegrante: this.ideIntegrante,
        flgInvitado: this.flagInvitado,
        persona: this.getPersona(this.formData.get("ideColaborador").value),
      });
    } else {
      // this.miembrosList = this.integrantesStateService.items()
      console.log(this.miembrosList);
      this.onSaveList.emit(this.miembrosList.filter(item=> item.checked === true));
    }

    this.submitted = true;
    this.modalService?.hide();
  }

  private getTxtOficina(id: number): string {
    const item = this.oficinasStateService
      .items()
      .find((x) => x.ideOficina === id);
    return item?.txtOficina ?? "";
  }

  private getTxtPersona(idePersona: number): string {
    const item = this.personasStateService
      .items()
      .find((x) => x.idePersona == idePersona);
    return item?.txtApellidos + ", " + item?.txtNombres;
  }

  private getTxtCargoPersona(idePersona: number): string {
    const item = this.personasStateService
      .items()
      .find((x) => x.idePersona == idePersona);
    return item?.txtCargo;
  }

  private getPersona(idePersona: number): Persona {
    const item = this.personasStateService
      .items()
      .find((x) => x.idePersona == idePersona);
    return item;
  }

  get form() {
    return this.formData.controls;
  }

  listarOficinas() {
    this.oficinasStateService.loadItems();
  }

  listarPersonasByOficina(ideOficina) {
    this.personasStateService.loadItemsByOficina(ideOficina);
  }
}
