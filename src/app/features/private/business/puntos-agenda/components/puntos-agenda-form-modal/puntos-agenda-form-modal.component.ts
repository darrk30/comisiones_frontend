import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { PuntoAgenda } from '../../data/punto-agenda.model';

@Component({
  selector: 'app-puntos-agenda-form-modal',
  standalone: true,
  imports: [ModalModule,FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './puntos-agenda-form-modal.component.html',
  styleUrl: './puntos-agenda-form-modal.component.css'
})

export class PuntosAgendaFormModalComponent  {
  private modalService = inject(BsModalService);
  private formBuilder = inject(FormBuilder);

  @Input() puntoAgenda: PuntoAgenda = null;
  @Input() flagActionLocal: number;

  @Output() onSave = new EventEmitter<any>();

  ideAgenda: number | null = null;

  formData: FormGroup = this.formBuilder.group({
    ideAgenda: [0],
    ideReunion: [0],
    txtAgenda: [ , Validators.required],
    txtDetalle: [ , Validators.required]
  });

  submitted = false;

  ngOnInit():void {
    console.log(this.puntoAgenda);
  //     this.formData = this.formBuilder.group({
  //   tema: [this.puntoAgenda?.txtAgenda || '', Validators.required],
  //   detalle: [this.puntoAgenda?.txtDetalle || '', Validators.required]
  // });
    this.ideAgenda = (this.puntoAgenda? this.puntoAgenda.ideAgenda : 0)

		// this.listarOficinas();
    // if(this.flagActionLocal==1){

    // }
    if (this.flagActionLocal == 2) {
      this.formData.patchValue(this.puntoAgenda);
      // if (this.flagActionLocal == 3) {
      //   this.formData.disable();
      // }
    }
  }

  grabar() {
    console.log(this.formData.value);
    console.log(this.ideAgenda);

    if (this.formData.invalid){
      this.submitted = true;
      return;
    }

    this.onSave.emit({
      ...this.formData.value,
      ideAgenda: this.ideAgenda
    });
    this.formData.reset();
    this.submitted = true;
    this.modalService?.hide();

  }

  get form() {
		return this.formData.controls;
	}
}
