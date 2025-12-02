import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
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
import { Integrante } from '../../../integrantes/data/integrante.model';
import Swal from 'sweetalert2';

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

  modalRef?: BsModalRef<ParticipantesFormModalComponent>;
  @ViewChild("modalEntidad", { static: false }) modalTemplate: any;

  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  dtTrigger: Subject<void> = new Subject<any>();

  dtOptions: DataTables.Settings = {};

  @Input() ideReunion: number;
  @Input() flagAction: number;

  @Output() listChange = new EventEmitter<any[]>();

  integrante: Integrante //participante
  tituloModal: string;
  titulo: string
  flagActionLocal:number;
  flagInvitado:number;
  idxCurrent: number

  @Input() lista: any[] = [];

  ngOnInit():void{
    this.inicializar()
  }

  inicializar(){
    if(!this.flagInvitado){
      this.titulo = 'Miembro'
    }else{
      this.titulo = 'Invitado'
    }

  }

  private emitirLista() {
    this.listChange.emit([...this.lista]); // se envía copia inmutable
  }

  crear(esInvitado) {

    this.flagInvitado = esInvitado
    this.inicializar()
     this.tituloModal = "Agregar "+ this.titulo;
     // let integrante: integrante ={
     //   ideReunion: 0,
     // }
     // this.integrante = integrante
     this.flagActionLocal = 1;
     this.modalRef = this.modalService.show(this.modalTemplate, {
       class: "md modal-lg",
       backdrop: "static",
       keyboard: false,
     });

  }

  //  editar(item: any) {
  //    this.tituloModal = "Editar "+this.titulo;
  //    this.flagAction = 2;
  //    this.modalRef = this.modalService.show(this.modalTemplate, {
  //      class: "md modal-lg",
  //      backdrop: "static",
  //      keyboard: false,
  //    });
  //    this.integrante = item
  //  }

   load(data: any) {
     console.log("data:", data);
     console.log('flagAction',this.flagAction);
     console.log('list: ',this.lista);

     if (this.flagActionLocal == 1) {
       const item = {
         ideIntegrante: 0,
         ideTabla:  this.ideReunion,
         txtTabla: data.txtTabla,
         ideOficina: data.ideOficina,
         ideColaborador: parseInt(data.ideColaborador),
         ideCargo: data.ideCargo,
         txtCargoComite: data.txtCargoComite,
         flgInvitado: data.flgInvitado,
         persona:{
          txtOficina: data.persona.txtOficina,
          txtApellidos: data.persona.txtApellidos,
          txtNombres: data.persona.txtNombres,
          txtCargo: data.persona.txtCargo
          }

       };

       this.lista.push(item);
       this.emitirLista()

     } else if (this.flagActionLocal == 2) {
       this.lista[this.idxCurrent] = data;
       this.emitirLista()
     }

     this.modalRef?.hide();
   }

   loadItems(data: any[]){

    this.lista = this.lista.filter(item=> item.flagInvitado)
    data.forEach(dataItem => {
        const item = {
         ideIntegrante: 0,
         ideTabla: this.ideReunion,
         txtTabla: dataItem.txtTabla,
         ideOficina: dataItem.ideOficina,
         ideColaborador: dataItem.ideColaborador,
         ideCargo: dataItem.ideCargo,
         txtCargoComite: dataItem.txtCargoComite,
         flgInvitado: dataItem.flgInvitado,
          persona:{
            txtOficina: dataItem.persona.txtOficina,
            txtApellidos: dataItem.persona.txtApellidos,
            txtNombres: dataItem.persona.txtNombres,
            txtCargo: dataItem.persona.txtCargo
          }
       };

       this.lista.push(item);
      })

      this.emitirLista()
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
