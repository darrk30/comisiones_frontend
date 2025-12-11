import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { transformFormData } from '@/app/core/helpers/clean-form';
import { Acuerdo } from '../../../acuerdos/data/acuerdo.modal';

@Component({
  selector: 'app-acciones-acuerdo-form-modal',
  standalone: true,
  imports: [
       ModalModule,FormsModule,ReactiveFormsModule,CommonModule,NgSelectModule,
  ],
  templateUrl: './acciones-acuerdo-form-modal.component.html',
  styleUrl: './acciones-acuerdo-form-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccionesAcuerdoFormModalComponent {
  private modalService = inject(BsModalService);
  private formBuilder = inject(FormBuilder);

  @Input() flagAction: number;
  @Input() acuerdo: Acuerdo

  formData: FormGroup = this.formBuilder.group({
    ideAcuerdoAccion: [],
    ideReunion: [],
    txtEquipoTrabajo: [],
    txtCodigoActaReunion: [],
    txtAcuerdo: [],
    txtAccionRealizada: [],
  })

  submitted = false;
	fileError: boolean = false;
	selectedFileName: string | null = null;

  ngOnInit():void{
    this.formData.get('txtEquipoTrabajo').disable()
    this.formData.get('txtCodigoActaReunion').disable()
    this.formData.get('txtAcuerdo').disable()
  }

  onFileSelected(event: any): void {
		const file = event.target.files[0];
		if (file) {
			this.formData.patchValue({
				archivo: file
			});
			this.selectedFileName = file.name;
			// this.formData.get('archivo')?.updateValueAndValidity(); // Actualiza el estado de validación del campo
			this.fileError = false;
		} else {
			this.selectedFileName = 'Ningún archivo seleccionado';
		  	this.fileError = true; // Marca error si no hay archivo seleccionado
		}
	}

  grabar(){
    if (this.formData.valid) {
      const formDataTransformed = transformFormData(this.formData.getRawValue());

      // this.integrantesStateService.postForm(formDataTransformed,this.formData.get('ideIntegrante').value?this.formData.get('ideIntegrante').value:null, () => {
      //   this.modalService?.hide();
      //   this.onSave.emit();
      // });

    }
    // console.log(this.formData)
    console.log(this.formData.value)
    this.submitted = true
  }

  triggerFileInput() {
		const fileInput = document.getElementById('fileInput') as HTMLInputElement;
		fileInput.click();
	}

  descargar(){

  }

 }
