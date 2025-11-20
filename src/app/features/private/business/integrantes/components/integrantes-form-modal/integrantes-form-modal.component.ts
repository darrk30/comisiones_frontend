import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { EquiposTrabajoStateService } from '../../../comisiones/services/equipos-trabajo-state.service';
import { IntegrantesStateService } from '../../services/integrantes-state.service';
import { transformFormData } from '@/app/core/helpers/clean-form';
import { Integrante } from '../../data/integrante.model';
import { OficinasStateService } from '@/app/features/private/maintenance/oficinas/services/oficinas-state.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { PersonasStateService } from '@/app/features/private/maintenance/personas/services/personas-state.service';

@Component({
  selector: 'app-integrantes-form-modal',
  templateUrl: './integrantes-form-modal.component.html',
  styleUrl: './integrantes-form-modal.component.css',
  standalone: true,
	imports:[ModalModule,FormsModule,ReactiveFormsModule,CommonModule,NgSelectModule]
})
export class IntegrantesFormModalComponent {

	private modalService = inject(BsModalService);
	private formBuilder = inject(FormBuilder);
  public integrantesStateService = inject(IntegrantesStateService)
  public equiposTrabajoStateService = inject(EquiposTrabajoStateService);
	public oficinasStateService = inject(OficinasStateService);
	public personasStateService = inject(PersonasStateService);

  @Input() integrante:Integrante;
	@Input() flagAccion: number;

	@Output() onSave = new EventEmitter<void>();

  formData: FormGroup = this.formBuilder.group({
    ideIntegrante: [],
    ideTabla: [,[Validators.required]], //ideEquipoTrabajo
    txtTabla: ['TMC_EQUIPO_TRABAJO',[Validators.required]],
    ideOficina: [,[Validators.required]],
    ideColaborador: [],
    ideCargo: [],
    txtCargoComite: [],
    flgInvitado: [false]
	});

  submitted = false;

	constructor(){
		this.formData.get('ideOficina')?.valueChanges.subscribe((v) => {
			if(!v || v==null) return;
			console.log('oficina:',v)
			this.listarPersonasByOficina(v)
		});
	}

  ngOnInit(): void {
		this.listarOficinas();
		this.formData.patchValue(this.integrante);
		if(this.flagAccion == 3) {
			this.formData.disable();
		}
	}

  listarOficinas(){
		this.oficinasStateService.loadItems();
	}

	listarPersonasByOficina(ideOficina){
		this.personasStateService.loadItemsByOficina(ideOficina);
	}


  grabar(){
		if (this.formData.valid) {
			const formDataTransformed = transformFormData(this.formData.getRawValue());

			this.integrantesStateService.postForm(formDataTransformed,this.formData.get('ideIntegrante').value?this.formData.get('ideIntegrante').value:null, () => {
				this.modalService?.hide();
				this.onSave.emit();
			});

		}
		// console.log(this.formData)
		console.log(this.formData.value)
		this.submitted = true
	}


  get form() {
		return this.formData.controls;
	}

 }
