import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { PuntosAgendaFormModalComponent } from "../puntos-agenda-form-modal/puntos-agenda-form-modal.component";
import { PuntoAgenda } from '../../data/punto-agenda.model';
import Swal from 'sweetalert2';

@Component({
  selector: "app-puntos-agenda-list",
  templateUrl: "./puntos-agenda-list.component.html",
  styleUrl: "./puntos-agenda-list.component.css",
  standalone: true,
  imports: [
    DataTablesModule,BsDropdownModule,CommonModule,NgSelectModule,FormsModule,ReactiveFormsModule,
    PuntosAgendaFormModalComponent,
  ],
})
export class PuntosAgendaListComponent {
  private modalService = inject(BsModalService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  modalRef?: BsModalRef<PuntosAgendaFormModalComponent>;
  @ViewChild("modalEntidad", { static: false }) modalTemplate: any;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtTrigger: Subject<void> = new Subject<any>();

  dtOptions: DataTables.Settings = {};

  // @Input() ideReunion: number;
  @Input() flagAction: number;

  // @Output() puntosAgenda: PuntoAgenda[] = []
  @Output() listChange = new EventEmitter<any[]>();

  puntoAgenda: PuntoAgenda;
  tituloModal: string;
  flagAccion: number;

  lista: any[] = []; //******/

  ngOnInit(): void {
    // this.listar();
    // this.flagAccion = this.flagAction
    console.log(this.flagAction);
  }

  private emitirLista() {
    this.listChange.emit([...this.lista]); // se envía copia inmutable
  }

  crear() {
    // console.log('ideReunion: ',this.ideReunion);
    this.tituloModal = "Agregar punto de agenda";
    // let puntoAgenda: PuntoAgenda ={
    //   ideReunion: 0,
    // }
    // this.puntoAgenda = puntoAgenda
    this.flagAction = 1;
    this.modalRef = this.modalService.show(this.modalTemplate, {
      class: "md modal-lg",
      backdrop: "static",
      keyboard: false,
    });
  }

  editar(item: any) {
    this.tituloModal = "Editar punto de agenda";
    this.flagAction = 2;
    this.modalRef = this.modalService.show(this.modalTemplate, {
      class: "md modal-lg",
      backdrop: "static",
      keyboard: false,
    });
    this.puntoAgenda = item
  }

  load(data: any) {
    console.log("data:", data);
    console.log('flagAction',this.flagAction);

    console.log('list: ',this.lista);

    if (this.flagAction == 1) {
      const item = {
        ideAgenda: this.lista.length + 1,
        txtAgenda: data.txtAgenda,
        txtDetalle: data.txtDetalle,
      };

      this.lista.push(item);
      this.emitirLista()

    } else if (this.flagAction == 2) {
      const idxItem = this.lista.findIndex(x=>x.ideAgenda == data.ideAgenda)
      this.lista[idxItem] = data;

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
