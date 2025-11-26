import { Component, inject, Input, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';


@Component({
selector: 'app-participantes-form-modal',
templateUrl: './participantes-form-modal.component.html',
styles: '',
standalone: true,
imports:[],
})

export class ParticipantesFormModalComponent {
  private modalService = inject(BsModalService);
  private formBuilder = inject(FormBuilder);

  @Input() flagAccion: number;
}
