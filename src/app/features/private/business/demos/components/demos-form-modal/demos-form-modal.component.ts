import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { DemosStateService } from '../../services/demos-state.service';
import { Demo } from '../../data/demo.model';
import { transformFormData } from '@/app/core/helpers/clean-form';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-demos-form-modal',
	templateUrl: './demos-form-modal.component.html',
	styleUrl: './demos-form-modal.component.css',
	standalone:true,
	imports:[ModalModule,FormsModule,ReactiveFormsModule,CommonModule]
})
export class DemosFormModalComponent {
	private modalService = inject(BsModalService);
	private formBuilder = inject(FormBuilder);
	public demosStateService = inject(DemosStateService);

	@Input() demo:Demo;
	@Output() onSave = new EventEmitter<void>();

	formData: FormGroup = this.formBuilder.group({
		ideDemo: [],
		demo: [],
	});

	submitted = false;


	constructor(){
		// this.formData.get('ideTipoDocumento')?.valueChanges.subscribe((v) => {
			
		// });
	}

	ngOnInit(): void {
		//this.formData.patchValue(this.perfil);
		//this.archivosStateService.clearState();
		this.formData.patchValue(this.demo);
	} 

	grabar(){
		if (this.formData.valid) {
			//const nuevoPerfil: Perfil = this.formData.value;
			
			const formDataTransformed = transformFormData(this.formData.getRawValue());

			this.demosStateService.postForm(formDataTransformed,this.formData.get('ideDemo').value?this.formData.get('ideDemo').value:null, () => {
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
