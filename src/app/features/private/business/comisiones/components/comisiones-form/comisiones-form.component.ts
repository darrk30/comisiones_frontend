import { Component, effect, inject, numberAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper'
import { PagetitleComponent } from "@/app/shared/components/pagetitle/pagetitle.component";
import { IntegrantesListComponent } from "../../../integrantes/components/integrantes-list/integrantes-list.component";
import { ArchivosListComponent } from "../../../archivos/components/archivos-list/archivos-list.component";
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TiposEquipoTrabajoStateService } from '@/app/features/private/maintenance/tipos-equipo-trabajo/services/tipos-equipo-trabajo-state.service';
import { MotivosEquipoTrabajoStateService } from '@/app/features/private/maintenance/motivos-equipo-trabajo/services/motivos-equipo-trabajo-state.service';
import { EstadosTrazabilidadStateService } from '@/app/features/private/maintenance/estados-trazabilidad/services/estados-trazabilidad-state.service';
import { limpiarCamposVacios, toDateInputValue, transformFormData } from '@/app/core/helpers/clean-form';
import { EquiposTrabajoStateService } from '../../services/equipos-trabajo-state.service';
import { EstadosComisionStateService } from '@/app/features/private/maintenance/estados-comision/services/estados-comision-state.service';
import { environment } from '@/environments/environment';
import { fechasValidator } from '../../validator/fechas.validator';

@Component({
  selector: 'app-comisiones-form',
  templateUrl: './comisiones-form.component.html',
  styleUrl: './comisiones-form.component.css',
  standalone: true,
  imports:[CommonModule,PagetitleComponent,NgStepperModule,CdkStepperModule,FormsModule,ReactiveFormsModule,ArchivosListComponent, IntegrantesListComponent]
})
export class ComisionesFormComponent {

  private route = inject(ActivatedRoute);
	private formBuilder = inject(FormBuilder);
	private toastr = inject(ToastrService);
	private spinner = inject(NgxSpinnerService);
  public tiposEquipoTrabajoStateService = inject(TiposEquipoTrabajoStateService)
  public motivosEquipoTrabajoStateService = inject(MotivosEquipoTrabajoStateService)
  // public estadosTrazabilidadStateService = inject(EstadosTrazabilidadStateService)
  public estadosComisionStateService = inject(EstadosComisionStateService)
  public equiposTrabajoStateService = inject(EquiposTrabajoStateService)

	breadCrumbItems: Array<{}>;

  formData: FormGroup = this.formBuilder.group({
    ideEquipoTrabajo: [],
    txtEquipoTrabajo: [,[Validators.required]],
    ideTipoEquipoTrabajo: [,[Validators.required]],
    ideMotivoEquipoTrabajo: [,[Validators.required]],
    ideEstadoComision: [,[Validators.required]],
    txtObjetivosEquipoTrabajo: [],
    fecSuscripcion: [],
    fecInicio: [],
    fecFinalizacion: [],
    fecInicioRenovacion: [],
    fecFinRenovacion:[],
    txtArchivo: [],
    txtArchivoRuta: [],
    txtDuracionComite: [{value:null,disabled:true}],
    txtObservacion: [],
 		// archivo: [, [this.validateTamanioArchivo.bind(this), this.validateFormatoArchivo]],
    uuid: []

  },{
		validators: fechasValidator
  })

  submitted = false;
	fileError: boolean = false;
	selectedFileName: string | null = null;

	tamanioArchivo:number = environment.tamanioArchivoMB;


  ideEquipoTrabajo:number;
	titleComponent:string;
	flagAction:number;
	idePagina:number;

  constructor(){
    this.route.data.subscribe((data) => {
            this.titleComponent = data.title;
            this.flagAction = data.flagAction;
        });

    this.ideEquipoTrabajo =  Number(this.route.snapshot.paramMap.get('id'))

    this.formData.get('fecInicio')?.valueChanges.subscribe(() => {
			this.actualizarDuracionConvenio();
		});

		this.formData.get('fecFinalizacion')?.valueChanges.subscribe(() => {
			this.actualizarDuracionConvenio();
		});

    effect(() => {
			const item = this.equiposTrabajoStateService.item();
			if (item) {
				console.log("Nuevo valor recibido:", item);
				const datosTransformados = {
					...item,
					fecSuscripcion: toDateInputValue(item.fecSuscripcion),
					fecInicio: toDateInputValue(item.fecInicio),
					fecFinalizacion: toDateInputValue(item.fecFinalizacion),
					fecInicioRenovacion: toDateInputValue(item.fecInicioRenovacion),
					fecFinRenovacion: toDateInputValue(item.fecFinRenovacion),
				};
				this.formData.patchValue(datosTransformados);

			}
		});
  }

  ngOnInit(): void {
		console.log('flagAction: ',this.flagAction)

		this.breadCrumbItems = [{ label: this.titleComponent }];
		this.equiposTrabajoStateService.clearState();
		this.listarTiposEquipoTrabajo();
    this.listarMotivosEquipoTrabajo()
    // this.listarEstadosTrazabilidad()
    this.listarEstadosComision()
		this.getEquipoTrabajo();

		if (this.flagAction == 1) { // Modo CREAR
			this.formData.get('archivo')?.addValidators(Validators.required);
			this.idePagina = 1;
		}else if(this.flagAction == 2){
			this.idePagina = 1;
		}else if(this.flagAction == 3) { // Modo CREAR
			this.formData.disable();
			this.idePagina = 3;
		}
	}

  grabar(){
    const raw = this.formData.getRawValue()
    const limpio = limpiarCamposVacios(raw)
    console.log(raw);

    // this.formData.patchValue(limpio)
    if(this.formData.valid){
 			const formDataClean = transformFormData(this.formData.getRawValue());
      this.equiposTrabajoStateService.postForm(formDataClean, this.formData.get('ideEquipoTrabajo').value)
    }

    this.submitted = true
  }

  getEquipoTrabajo(){
		if(!this.ideEquipoTrabajo) return;
		this.equiposTrabajoStateService.loadItemById(this.ideEquipoTrabajo);
  }


  listarTiposEquipoTrabajo(){
		this.tiposEquipoTrabajoStateService.loadItems();
	}

  listarMotivosEquipoTrabajo(){
		this.motivosEquipoTrabajoStateService.loadItems();
	}

  listarEstadosComision(){
		this.estadosComisionStateService.loadItems();
	}

  actualizarDuracionConvenio() {
		const fechaInicio = this.formData.get('fecInicio')?.value;
		const fechaFin = this.formData.get('fecFinalizacion')?.value;

		if (fechaInicio && fechaFin) {
			const inicio = new Date(fechaInicio);
			const fin = new Date(fechaFin);

			if (fin < inicio) {
				this.formData.get('txtDuracionComite')?.setValue('Fecha final menor que inicio');
				return;
			}

			const años = fin.getFullYear() - inicio.getFullYear();
			const meses = fin.getMonth() - inicio.getMonth();
			const dias = fin.getDate() - inicio.getDate();

			let totalAños = años;
			let totalMeses = meses;
			let totalDias = dias;

			if (totalDias < 0) {
				totalMeses--;
				const prevMonth = new Date(fin.getFullYear(), fin.getMonth(), 0);
				totalDias += prevMonth.getDate();
			}

			if (totalMeses < 0) {
				totalAños--;
				totalMeses += 12;
			}

			const texto = `${totalAños} año(s), ${totalMeses} mes(es), ${totalDias} día(s)`;
			this.formData.get('txtDuracionComite')?.setValue(texto);
		} else {
			this.formData.get('txtDuracionComite')?.setValue(null);
		}
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

}
