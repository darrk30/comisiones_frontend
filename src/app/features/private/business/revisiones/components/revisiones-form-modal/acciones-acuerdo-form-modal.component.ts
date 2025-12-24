import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { transformFormData } from '@/app/core/helpers/clean-form';
import { Acuerdo } from '../../../acuerdos/data/acuerdo.model';
import { environment } from '@/environments/environment';
import { AccionesAcuerdoStateService } from '../../services/acciones-acuerdo-state.service';
import { AccionAcuerdo } from '../../data/accion-acuerdo.model';
import { ArchivoStore } from '../../../archivos/services/archivo.store';
import { saveAs } from "file-saver";
import { ArchivosStateService } from '../../../archivos/services/archivos-state.service';


@Component({
  selector: "app-acciones-acuerdo-form-modal",
  standalone: true,
  imports: [
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgSelectModule,
  ],
  templateUrl: "./acciones-acuerdo-form-modal.component.html",
  styleUrl: "./acciones-acuerdo-form-modal.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccionesAcuerdoFormModalComponent {
  private modalService = inject(BsModalService);
  private formBuilder = inject(FormBuilder);
  private accionesAcuerdoStateService = inject(AccionesAcuerdoStateService);
  public archivosStateService = inject(ArchivosStateService);
  public archivoStore = inject(ArchivoStore);

  archivoBase64: string | null = null;

  @Input() flagAction: number;
  @Input() acuerdo: Acuerdo;

  // @Output() onSave = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();

  formData: FormGroup = this.formBuilder.group({
    ideAcuerdoAccion: [],
    ideAcuerdo: [],
    txtEquipoTrabajo: [],
    txtActaReunion: [],
    txtAcuerdo: [],
    txtAccionRealizada: [, [Validators.required]],
    base64: [],
    archivo: [
      null,
      [
        Validators.required,
        this.validateTamanioArchivo.bind(this),
        this.validateFormatoArchivo,
      ],
    ],
    txtArchivo: [],
    ideArchivo: [null],
    uuid:[]
  });

  submitted = false;
  fileError: boolean = false;
  selectedFileName: string | null = null;
  accionAcuerdo: AccionAcuerdo

  tamanioArchivo: number = environment.tamanioArchivoMB;

  ngOnInit(): void {
    console.log(this.acuerdo);
    console.log(this.flagAction);

    if(this.flagAction==2){

      this.accionesAcuerdoStateService.loadItemByIdeAcuerdo(this.acuerdo.ideAcuerdo).subscribe(()=>{
        this.accionAcuerdo = this.accionesAcuerdoStateService.item()
        console.log(this.accionAcuerdo);
       this.formData.get("ideAcuerdoAccion").setValue(this.accionAcuerdo.ideAcuerdoAccion);
       this.formData.get("ideAcuerdo").setValue(this.accionAcuerdo.ideAcuerdo);

       this.formData.get("txtAccionRealizada").setValue(this.accionAcuerdo.txtAccionRealizada);
       this.formData.get("archivo").setValue(this.accionAcuerdo.archivo);
       this.formData.get("txtArchivo").setValue(this.accionAcuerdo.archivo.txtArchivo);
       this.formData.get("ideArchivo").setValue(this.accionAcuerdo.archivo.ideArchivo);
       this.formData.get("uuid").setValue(this.accionAcuerdo.archivo.uuid);

       console.log( this.formData.value);


        // console.log(this.formData.get("txtArchivo").value);

      })

      // accionAcuerdo = this.accionesAcuerdoStateService.item()
    }

    this.formData.get("txtEquipoTrabajo").setValue(this.acuerdo.txtEquipoTrabajo);
    this.formData.get("txtActaReunion").setValue(`${this.acuerdo.txtCodigoActaReunion}-${this.acuerdo.txtAnio}`);
    this.formData.get("txtAcuerdo").setValue(this.acuerdo.txtAcuerdo);
    this.formData.get("ideAcuerdo").setValue(this.acuerdo.ideAcuerdo);

    this.formData.get("txtEquipoTrabajo").disable();
    this.formData.get("txtActaReunion").disable();
    this.formData.get("txtAcuerdo").disable();
    console.log( this.formData.value);

  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      this.selectedFileName = file.name;

      console.log(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.archivoBase64 = reader.result as string; // Incluye "data:...;base64,"

        this.formData.patchValue({
          archivo: file,
          // base64: this.archivoBase64,
          base64: this.archivoBase64.split(",")[1],
          txtArchivo: this.selectedFileName,
        });

        this.formData.get("archivo")?.updateValueAndValidity(); // Actualiza el estado de validación del campo
      };
      reader.readAsDataURL(file);

      this.fileError = false;
    } else {
      this.selectedFileName = "Ningún archivo seleccionado";
      this.fileError = true; // Marca error si no hay archivo seleccionado
    }
  }

  grabar() {

    if (this.formData.valid) {
      const formDataTransformed = transformFormData(
        this.formData.getRawValue()
      );

      // //ACTUALIZAR ESTADO EN FRONTEND
      // this.onSave.emit({
      //   ideAcuerdo: this.acuerdo.ideAcuerdo,
      //   nuevoEstado: {
      //     ideEstadoTiempo: 1,
      //     txtEstadoTiempo: 'Atendido',
      //     // txtColorHex: '#28a745' // verde
      //   }
      // });
      //  this.modalService?.hide();

      this.accionesAcuerdoStateService.postForm(formDataTransformed,this.formData.get("ideAcuerdoAccion").value? this.formData.get("ideAcuerdoAccion").value: null,() => {

        if(this.flagAction == 1){
        this.onSave.emit({
            ideAcuerdo: this.acuerdo.ideAcuerdo,
            nuevoEstado: {
              ideEstadoTiempo: 1,
              txtEstadoTiempo: "Atendido",
              // txtColorHex: '#28a745' // verde
            },
          });
        }
          this.modalService?.hide();
          this.onSave.emit();
        }
      );
    }
    // console.log(this.formData)
    console.log(this.formData.value);
    this.submitted = true;
  }

  triggerFileInput() {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    fileInput.click();
  }

  validateTamanioArchivo(control: AbstractControl): ValidationErrors | null {
    const archivo = control.value as File;
    if (!archivo) {
      return null;
    }
    if (
      archivo &&
      archivo.size > 0 &&
      archivo.size <= this.tamanioArchivo * 1024 * 1024
    ) {
      // Tamaño entre 0 y 5 MB
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
    if (archivo) {
      const extension = archivo.name.split(".").pop()?.toLowerCase();
      if (extension === "pdf") {
        // Archivo PDF
        return null; // Válido
      } else {
        return { formatoInvalido: true }; // Formato no válido
      }
    }
  }

  descargar() {
    if(!this.formData.get('uuid').value) return
		const uuid =  this.formData.get('uuid').value //archivo.uuid;
		this.archivoStore.descargarById(this.formData.get('ideArchivo').value).subscribe({
			next: (blob) => {
				saveAs(blob, `${uuid}.pdf`);
			},
			error: (error) => {
				console.error('Error al descargar el PDF', error);
			}
		});

  }
}
