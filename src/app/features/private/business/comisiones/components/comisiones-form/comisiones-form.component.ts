import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper'
import { PagetitleComponent } from "@/app/shared/components/pagetitle/pagetitle.component";
import { IntegrantesListComponent } from "../../../integrantes/components/integrantes-list/integrantes-list.component";
import { ArchivosListComponent } from "../../../archivos/components/archivos-list/archivos-list.component";
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-comisiones-form',
  templateUrl: './comisiones-form.component.html',
  styleUrl: './comisiones-form.component.css',
  standalone: true,
  imports: [CommonModule, PagetitleComponent, CdkStepperModule, NgStepperModule, IntegrantesListComponent, ArchivosListComponent]
})
export class ComisionesFormComponent {

  private route = inject(ActivatedRoute);
	private formBuilder = inject(FormBuilder);
	private toastr = inject(ToastrService);
	private spinner = inject(NgxSpinnerService);
	// public conveniosStateService = inject(ConveniosStateService);

	breadCrumbItems: Array<{}>;

  formData: FormGroup = this.formBuilder.group({
    //TODO: add fields
  },{

  })

  submitted = false;
	fileError: boolean = false;
	selectedFileName: string | null = null;

  ideComision:number;
	titleComponent:string;
	flagAction:number;
	idePagina:number;

  constructor(){
    this.route.data.subscribe((data) => {
            this.titleComponent = data.title;
            this.flagAction = data.flagAction;
        });
  }

  ngOnInit(): void {
		console.log(this.flagAction)

		this.breadCrumbItems = [{ label: this.titleComponent }];
		// this.conveniosStateService.clearState();
		// this.listarTiposConvenios();
		// this.listarModalidadesConvenios();
		// this.listarEstadosConvenios();
		// this.getConvenio();

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

}
