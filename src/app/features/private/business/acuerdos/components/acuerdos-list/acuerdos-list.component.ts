import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AcuerdosFormModalComponent } from '../acuerdos-form-modal/acuerdos-form-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-acuerdos-list',
  templateUrl: './acuerdos-list.component.html',
  styles: '',
  standalone:true,
  imports: [DataTablesModule, BsDropdownModule, CommonModule, NgSelectModule, FormsModule, ReactiveFormsModule, AcuerdosFormModalComponent],
})

export class AcuerdosListComponent  {
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
  @Input() flagTarea:number;

  tituloModal: string;
  titulo: string;
  // flagAction:number;
  flagAccion:number;

  ngOnInit():void{
    if(!this.flagTarea){
      this.titulo = 'Acuerdo'
    }else{
      this.titulo = 'Tarea'
    }
  }

  crear(modal:any){
    // console.log('ideEquipoTrabajo: ',this.ideEquipoTrabajo);
    this.tituloModal = 'Acuerdo';
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
