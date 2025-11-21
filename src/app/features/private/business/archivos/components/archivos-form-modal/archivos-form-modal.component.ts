import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { transformFormData } from 'src/app/core/helpers/clean-form';
import { ArchivosStateService } from '../../services/archivos-state.service';
import { TiposDocumentosStateService } from 'src/app/features/private/maintenance/tipos-documentos/services/tipos-documentos-state.service';
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
	public tiposDocumentosStateService = inject(TiposDocumentosStateService);

  archivoBase64: string | null = null;

	@Input() archivo:Archivo;
	@Output() onSave = new EventEmitter<void>();

	formData: FormGroup = this.formBuilder.group({
		ideArchivo: [],
    ideTabla: [,[Validators.required]],
    txtTabla: ['TMC_EQUIPO_TRABAJO'],
		ideTipoDocumento: [,[Validators.required]],
		txtTipoDocumentoOtro: [],
    txtArchivo: [],
    base64:[],
		archivo: [null, [Validators.required,this.validateTamanioArchivo.bind(this), this.validateFormatoArchivo]],
	});

	submitted = false;
	fileError: boolean = false;
	selectedFileName: string | null = null;

	tamanioArchivo:number = environment.tamanioArchivoMB;

	constructor(){
		// this.formData.get('ideTipoDocumento')?.valueChanges.subscribe((v) => {

		// });
	}

	ngOnInit(): void {
		//this.formData.patchValue(this.perfil);
		//this.archivosStateService.clearState();
		this.listarTiposDocumentos();
		this.formData.patchValue(this.archivo);
	}

	listarTiposDocumentos(){
		this.tiposDocumentosStateService.loadItems();
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
		// console.log(this.formData)
		console.log(this.formData.value)
		this.submitted = true
	}

	get form() {
		return this.formData.controls;
	}

	validateTamanioArchivo(control: AbstractControl): ValidationErrors | null {

		const archivo = control.value as File;
		if (!archivo) {
			return null;
		}
		if (archivo && (archivo.size > 0 && archivo.size <= this.tamanioArchivo * 1024 * 1024)) { // Tamaño entre 0 y 5 MB
			return null;
		} else {
			return { tamanoInvalido: true };
		}
	}

	validateFormatoArchivo(control: AbstractControl): ValidationErrors | null {

		const archivo = control.value as File;
		if (!archivo) {
			return null;
		}
		if(archivo){
			const extension = archivo.name.split('.').pop()?.toLowerCase();
			if (extension === 'pdf') { // Archivo PDF
				return null; // Válido
			} else {
				return { formatoInvalido: true }; // Formato no válido
			}
		}

	}

	triggerFileInput() {
		const fileInput = document.getElementById('fileInput2') as HTMLInputElement;
		fileInput.click();
	}

	onFileSelected(event: any): void {
		const file = event.target.files[0];
		console.log(file)
		if (file) {
			this.selectedFileName = file.name;

      console.log(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.archivoBase64 = reader.result as string; // Incluye "data:...;base64,"

        this.formData.patchValue({
          archivo: file,
          // base64: this.archivoBase64,
          base64: this.archivoBase64.split(',')[1],
          txtArchivo: this.selectedFileName
        });

			  this.formData.get('archivo')?.updateValueAndValidity(); // Actualiza el estado de validación del campo

      };
      reader.readAsDataURL(file);

      this.fileError = false;

		} else {
			this.selectedFileName = 'Ningún archivo seleccionado';
		  	this.fileError = true; // Marca error si no hay archivo seleccionado
		}
	}
}
