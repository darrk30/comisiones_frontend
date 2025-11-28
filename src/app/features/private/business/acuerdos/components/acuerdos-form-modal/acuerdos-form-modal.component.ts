import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { Acuerdo } from '../../data/acuerdo.modal';
import { OficinasStateService } from '@/app/features/private/maintenance/oficinas/services/oficinas-state.service';
import { PersonasStateService } from '@/app/features/private/maintenance/personas/services/personas-state.service';

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
  @Input() flagAccion: number;
  @Input() flagTarea: number;

  @Output() onSave = new EventEmitter<any>();

  ideAcuerdo: number | null = null;

  formData: FormGroup = this.formBuilder.group({
    ideAcuerdo: [],
    ideReunion: [],
    txtAcuerdo: [],
    ideOficina: [],
    ideIntegrante: [],
    fecLimitePresentacion: [],
    flgTarea: []
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
    console.log(this.acuerdo);
    this.ideAcuerdo = this.acuerdo ? this.acuerdo.ideAcuerdo : 0;
    this.listarOficinas();
    this.formData.patchValue(this.acuerdo);
    if (this.flagAccion == 3) {
      this.formData.disable();
    }
  }

  grabar() {
    console.log(this.formData.value);
    console.log(this.ideAcuerdo);

    if (this.formData.invalid) return;

    this.onSave.emit({
      ...this.formData.value,
      ideAcuerdo: this.ideAcuerdo,
      flgTarea: this.flagTarea,
      txtOficina: this.getTxtOficina(this.formData.get("ideOficina").value),
      txtPersona: this.getTxtPersona(this.formData.get("ideIntegrante").value),
    });

    this.submitted = true;
    this.modalService?.hide();
  }

  private getTxtOficina(id: number): string {
    const item = this.oficinasStateService.items().find((x) => x.ideOficina === id);
    return item?.txtOficina ?? "";
  }

  private getTxtPersona(idePersona: number): string {
    const item = this.personasStateService.items().find(x => x.idePersona == idePersona);
    return (item?.txtApellidos + ', '+ item?.txtNombres );
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
