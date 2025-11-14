import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { transformFormData } from 'src/app/core/helpers/clean-form';
import { ArchivosStateService } from '../../services/archivos-state.service';
import { Archivo } from '../../data/archivo.model';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-archivos-form-modal',
	templateUrl: './archivos-form-modal.component.html',
	styleUrl: './archivos-form-modal.component.css',
	standalone:true,
	imports:[ModalModule,FormsModule,ReactiveFormsModule,CommonModule]
})
export class ArchivosFormModalComponent {
	private modalService = inject(BsModalService);
	private formBuilder = inject(FormBuilder);
	public archivosStateService = inject(ArchivosStateService);

	@Input() archivo:Archivo;
	@Output() onSave = new EventEmitter<void>();

	formData: FormGroup = this.formBuilder.group({
		ideArchivo: [],
		ideConvenio: [],
		archivo: [null, [Validators.required]],
	});

	submitted = false;

	tamanioArchivo:number = environment.tamanioArchivoMB;

	constructor(){
		// this.formData.get('ideTipoDocumento')?.valueChanges.subscribe((v) => {
			
		// });
	}

	ngOnInit(): void {
		//this.formData.patchValue(this.perfil);
		//this.archivosStateService.clearState();
		this.formData.patchValue(this.archivo);
	} 

	grabar(){
		if (this.formData.valid) {
			//const nuevoPerfil: Perfil = this.formData.value;
			
			const formDataTransformed = transformFormData(this.formData.getRawValue());

			this.archivosStateService.postForm(formDataTransformed,this.formData.get('ideArchivo').value?this.formData.get('ideArchivo').value:null, () => {
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
