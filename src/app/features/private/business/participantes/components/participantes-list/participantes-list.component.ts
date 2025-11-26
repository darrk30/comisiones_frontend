import { CommonModule } from '@angular/common';
import { Component, inject, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { dtOptionsData } from '@/app/core/helpers/dtoptions.data';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { ParticipantesFormModalComponent } from '../participantes-form-modal/participantes-form-modal.component';

@Component({
  selector: 'app-participantes-list',
  templateUrl: './participantes-list.component.html',
  styles: '',
  standalone: true,
  imports:[DataTablesModule,BsDropdownModule,CommonModule,NgSelectModule,FormsModule,ReactiveFormsModule,
    ParticipantesFormModalComponent
  ],
})

export class ParticipantesListComponent  {
  private modalService = inject(BsModalService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  modalRef?: BsModalRef;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  dtTrigger: Subject<void> = new Subject<any>();

  dtOptions: DataTables.Settings = {};

  // @Input() ideEquipoTrabajo: number;
  @Input() flagAction:number;

  tituloModal: string;
  // flagAction:number;
  flagAccion:number;

  crear(modal:any){
    // console.log('ideEquipoTrabajo: ',this.ideEquipoTrabajo);
    this.tituloModal = 'Participante';
    // let Integrante:Integrante = {
    //   // ideEquipoTrabajo: this.ideEquipoTrabajo
    //   ideTabla: this.ideEquipoTrabajo,
    //   txtTabla: 'TMC_EQUIPO_TRABAJO'
    // };
    // this.integrante = Integrante;
    this.flagAction = 1;
    this.modalRef = this.modalService.show(modal, { class: 'md modal-lg', backdrop: 'static', keyboard: false });
  }
}
