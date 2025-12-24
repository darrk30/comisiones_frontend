import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AcuerdosFormModalComponent } from '../acuerdos-form-modal/acuerdos-form-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Acuerdo } from '../../data/acuerdo.model';
import Swal from 'sweetalert2';

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

  modalRef?: BsModalRef<AcuerdosFormModalComponent>;
  @ViewChild("modalEntidad", { static: false }) modalTemplate: any;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtTrigger: Subject<void> = new Subject<any>();

  dtOptions: DataTables.Settings = {};

  @Input() ideReunion: number;
  @Input() flagAction:number;
  @Input() flagTarea:number;

  @Output() listChange = new EventEmitter<any[]>();

  acuerdo: Acuerdo
  tituloModal: string;
  titulo: string;
  flagActionLocal: number;
  idxCurrent: number

  // lista: any[] = [];
  @Input() lista: any[] = [];

  ngOnInit():void{
    if(!this.flagTarea){
      this.titulo = 'Acuerdo'
    }else{
      this.titulo = 'Tarea'
    }
  }

  private emitirLista() {
    this.listChange.emit([...this.lista]); // se envía copia inmutable
  }

  crear() {
    // console.log('ideReunion: ',this.ideReunion);
    this.tituloModal = "Agregar "+ this.titulo;
    // let acuerdo: acuerdo ={
    //   ideReunion: 0,
    // }
    // this.acuerdo = acuerdo
    this.flagActionLocal = 1;
    this.modalRef = this.modalService.show(this.modalTemplate, {
      class: "md modal-lg",
      backdrop: "static",
      keyboard: false,
    });
  }

  editar(item: any, idx:number) {
    this.tituloModal = "Editar "+this.titulo;
    this.flagActionLocal = 2;
    this.modalRef = this.modalService.show(this.modalTemplate, {
      class: "md modal-lg",
      backdrop: "static",
      keyboard: false,
    });
    this.acuerdo = item
    this.idxCurrent = idx
  }

  load(data: any) {
    console.log("data:", data);
    console.log('flagAction',this.flagAction);

    console.log('list: ',this.lista);

    if (this.flagActionLocal == 1) {
      const item = {
        ideAcuerdo: 0,  //this.lista.length + 1,
        ideReunion: this.ideReunion,
        txtAcuerdo: data.txtAcuerdo,
        ideOficina: data.ideOficina,
        ideIntegrante: data.ideIntegrante,
        fecLimitePresentacion: data.fecLimitePresentacion,
        flgTarea: data.flgTarea,
        persona: data.persona
        // ,
        // txtOficina: data.txtOficina,
        // txtPersona: data.txtPersona,
      };

      this.lista.push(item);
      this.emitirLista()

    } else if (this.flagActionLocal == 2) {
      // const idxItem = this.lista.findIndex(x=>x.ideAcuerdo == data.ideAcuerdo)
      // this.lista[idxItem] = data;
      this.lista[this.idxCurrent] = data;
      this.emitirLista()
    }

    this.modalRef?.hide();
  }

  eliminar(idx: number) {
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
        this.lista.splice(idx, 1);
        this.emitirLista();
        this.spinner.hide()
      }
    });
  }

}
