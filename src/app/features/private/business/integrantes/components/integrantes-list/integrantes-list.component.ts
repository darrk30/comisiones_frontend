import { CommonModule } from '@angular/common';
import { Component, inject, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { EquiposTrabajoStateService } from '../../../comisiones/services/equipos-trabajo-state.service';
import { IntegrantesStateService } from '../../services/integrantes-state.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { dtOptionsData } from '@/app/core/helpers/dtoptions.data';
import Swal from 'sweetalert2';
import { Integrante } from '../../data/integrante.model';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { IntegrantesFormModalComponent } from '../integrantes-form-modal/integrantes-form-modal.component';

@Component({
  selector: 'app-integrantes-list',
  templateUrl: './integrantes-list.component.html',
  styleUrl: './integrantes-list.component.css',
  standalone: true,
  // imports: [ModalModule,CommonModule],
  	imports:[DataTablesModule,BsDropdownModule,CommonModule,NgSelectModule,FormsModule,ReactiveFormsModule,IntegrantesFormModalComponent],

})
export class IntegrantesListComponent {

  private modalService = inject(BsModalService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  public equiposTrabajoStateService = inject(EquiposTrabajoStateService);
  public integrantesStateService = inject(IntegrantesStateService);

  modalRef?: BsModalRef;
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  dtTrigger: Subject<void> = new Subject<any>();

  dtOptions: DataTables.Settings = {};

  originalIntegrantes: Integrante[] = [];
  integrantesFiltrados: Integrante[] = [];

  @Input() ideEquipoTrabajo: number;
  @Input() flagAction:number;

  formData: FormGroup = this.formBuilder.group({
    ideEquipoTrabajo:[],
    fecEvaluacion:[],
  });

  Integrante:Integrante;
  tituloModal: string;
  flagAccion:number;

  ngOnInit(): void {
    this.dtOptions = dtOptionsData;
    this.integrantesStateService.clearState();
    this.listar();
    this.listarEquiposTrabajo();

    console.log(this.flagAction)
    // if(this.flagAccion == 3){
    // 	this.formData.disable();
    // }
  }

  listarEquiposTrabajo(){
    this.equiposTrabajoStateService.loadItems();
  }

  listar(){
    this.integrantesStateService.loadItemsByConvenio(this.ideEquipoTrabajo).subscribe(() => {
      this.originalIntegrantes = this.integrantesStateService.items();
      this.integrantesFiltrados = [...this.originalIntegrantes];
      this.rerender();
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    if(this.dtElement==undefined) return;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  crear(modal:any){
    this.tituloModal = 'Registrar Integrante';
    let Integrante:Integrante = {
      // ideConvenio: this.ideEquipoTrabajo
      ideTabla: this.ideEquipoTrabajo,
      txtTabla: 'EquipoTrabajo'
    };
    this.Integrante = Integrante;
    this.flagAccion = 1;
    this.modalRef = this.modalService.show(modal, { class: 'md modal-lg', backdrop: 'static', keyboard: false });
  }

  editar(modal:any,Integrante:Integrante){
    this.tituloModal = 'Editar Integrante';
    this.Integrante = Integrante;
    this.flagAccion = 2;
    this.modalRef = this.modalService.show(modal, { class: 'md modal-lg', backdrop: 'static', keyboard: false });
  }

  ver(modal:any,Integrante:Integrante){
    this.tituloModal = 'Ver Integrante';
    this.Integrante = Integrante;
    this.flagAccion = 3;
    this.modalRef = this.modalService.show(modal, { class: 'md modal-lg', backdrop: 'static', keyboard: false });
  }

  eliminar(ideIntegrante:number){
    Swal.fire({
      title: '¿Estás seguro de eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        this.spinner.show();
        this.integrantesStateService.deleteItem(ideIntegrante).subscribe(() => {
          this.listar();
        });
      }
    });
  }

  buscar(){
    // this.OficinasProponentesFiltrados = this.originalOficinasProponentes.filter(c => {
    // 	const convenioSeleccionado = this.formData.get('ideConvenio').value;
    // 	const fecEvaluacionSeleccionada = this.formData.get('fecEvaluacion').value;

    // 	const coincideConvenio = !convenioSeleccionado || c.convenio?.ideConvenio == convenioSeleccionado;
    // 	const coincideFecEvaluacion = !fecEvaluacionSeleccionada || toDateInputValue(c.fecEvaluacion) == String(fecEvaluacionSeleccionada);

    // 	return coincideConvenio && coincideFecEvaluacion;
    // });

    // this.rerender();
  }



 }
