import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { EquiposTrabajoStateService } from '../../../comisiones/services/equipos-trabajo-state.service';
import { IntegrantesStateService } from '../../services/integrantes-state.service';
import { transformFormData } from '@/app/core/helpers/clean-form';
import { Integrante } from '../../data/integrante.model';

@Component({
  selector: 'app-integrantes-form-modal',
  templateUrl: './integrantes-form-modal.component.html',
  styleUrl: './integrantes-form-modal.component.css',
  standalone: true,
  imports: [ModalModule,CommonModule],
})
export class IntegrantesFormModalComponent {
	private modalService = inject(BsModalService);
	private formBuilder = inject(FormBuilder);
  public integrantesStateService = inject(IntegrantesStateService)
  public equiposTrabajoStateService = inject(EquiposTrabajoStateService);
	// public oficinasStateService = inject(OficinasStateService);
	// public personasStateService = inject(PersonasStateService);
	@Input() integrante:Integrante;
	@Input() flagAccion: number;

	@Output() onSave = new EventEmitter<void>();

  formData: FormGroup = this.formBuilder.group({
		// ideOficinaProponente: [],
		// ideConvenio: [,[Validators.required]],
		// ideOficina: [,[Validators.required]],
		// ideCoordinadorTitular: [],
		// ideCoordinadorAlterno: [],
		// numAporteMonetario: [,[Validators.required]],
		// numAporteNoMonetario: [,[Validators.required]],
	});

  submitted = false;

	constructor(){
		this.formData.get('ideOficina')?.valueChanges.subscribe((v) => {
			if(!v || v==null) return;
			console.log(v)
			// this.listarPersonasByOficina(v)
		});
	}

  ngOnInit(): void {
		// this.listarOficinas();
		this.formData.patchValue(this.integrante);
		if(this.flagAccion == 3) {
			this.formData.disable();
		}
	}

  // listarOficinas(){
	// 	this.oficinasStateService.loadItems();
	// }

	// listarPersonasByOficina(ideOficina){
	// 	this.personasStateService.loadItemsByOficina(ideOficina);
	// }


  grabar(){
		if (this.formData.valid) {
			const formDataTransformed = transformFormData(this.formData.getRawValue());

			this.integrantesStateService.postForm(formDataTransformed,this.formData.get('ideIntegrante').value?this.formData.get('ideIntegrante').value:null, () => {
				this.modalService?.hide();
				this.onSave.emit();
			});

		}
		console.log(this.formData)
		this.submitted = true
	}


  get form() {
		return this.formData.controls;
	}

 }
