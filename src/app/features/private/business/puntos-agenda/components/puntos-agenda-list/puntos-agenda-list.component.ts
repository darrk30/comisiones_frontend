import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { PuntosAgendaFormModalComponent } from "../puntos-agenda-form-modal/puntos-agenda-form-modal.component";

@Component({
  selector: 'app-puntos-agenda-list',
  templateUrl: './puntos-agenda-list.component.html',
  styleUrl: './puntos-agenda-list.component.css',
  standalone: true,
  imports: [DataTablesModule, BsDropdownModule, CommonModule, NgSelectModule, FormsModule, ReactiveFormsModule, PuntosAgendaFormModalComponent],
})
export class PuntosAgendaListComponent {
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
    this.tituloModal = 'Agregar punto de agenda';
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
