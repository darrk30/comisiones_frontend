import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { Acuerdo } from '../../data/acuerdo.model';
import { OficinasStateService } from '@/app/features/private/maintenance/oficinas/services/oficinas-state.service';
import { PersonasStateService } from '@/app/features/private/maintenance/personas/services/personas-state.service';
import { fechasValidator } from '../../../comisiones/validator/fechas.validator';
import { toDateInputValue } from '@/app/core/helpers/clean-form';
import { Persona } from '@/app/features/private/maintenance/personas/data/persona.model';

@Component({
  selector: "app-acuerdos-form-modal",
  standalone: true,
  imports: [
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgSelectModule,
  ],
  templateUrl: "./acuerdos-form-modal.component.html",
  styles: ``,
})
export class AcuerdosFormModalComponent {
  private modalService = inject(BsModalService);
  private formBuilder = inject(FormBuilder);
  public oficinasStateService = inject(OficinasStateService);
  public personasStateService = inject(PersonasStateService);

  @Input() acuerdo: Acuerdo = null;
  @Input() flagActionLocal: number;
  @Input() flagTarea: number;

  @Output() onSave = new EventEmitter<any>();

  ideAcuerdo: number | null = null;

  formData: FormGroup = this.formBuilder.group({
    ideAcuerdo: [0],
    ideReunion: [0],
    txtAcuerdo: [, [Validators.required]],
    ideOficina: [, [Validators.required]],
    ideIntegrante: [, [Validators.required]],
    fecLimitePresentacion: [],
    flgTarea: [],
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
    console.log("acuerdo: ", this.acuerdo);
    this.ideAcuerdo = this.acuerdo ? this.acuerdo.ideAcuerdo : 0;
    this.listarOficinas();

    if (this.flagActionLocal == 2) {
      const acuerdoTransformado = {
        ...this.acuerdo,
        fecLimitePresentacion: toDateInputValue(
          this.acuerdo.fecLimitePresentacion
        ),
      };
      this.formData.patchValue(acuerdoTransformado);
    }

    if (this.flagActionLocal == 3) {
      this.formData.disable();
    }
  }

  grabar() {
    console.log(this.formData.value);
    console.log(this.ideAcuerdo);

    if (this.formData.invalid) {
      this.submitted = true;
      return;
    }

    this.onSave.emit({
      ...this.formData.value,
      ideAcuerdo: this.ideAcuerdo,
      flgTarea: this.flagTarea,
      // txtOficina: this.getTxtOficina(this.formData.get("ideOficina").value),
      // txtPersona: this.getTxtPersona(this.formData.get("ideIntegrante").value),
      persona: this.getPersona(this.formData.get("ideIntegrante").value),
    });
    this.formData.reset();
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
