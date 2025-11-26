import { Component } from '@angular/core';
import { NgStepperModule } from "angular-ng-stepper";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { CommonModule } from '@angular/common';
import { PagetitleComponent } from '@/app/shared/components/pagetitle/pagetitle.component';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PuntosAgendaListComponent } from "../../../puntos-agenda/components/puntos-agenda-list/puntos-agenda-list.component";
import { AcuerdosFormModalComponent } from "../../../acuerdos/components/acuerdos-form-modal/acuerdos-form-modal.component";
import { AcuerdosListComponent } from '../../../acuerdos/components/acuerdos-list/acuerdos-list.component';
import { ParticipantesListComponent } from "../../../participantes/components/participantes-list/participantes-list.component";

@Component({
  selector: "app-reuniones-form",
  templateUrl: "./reuniones-form.component.html",
  styleUrl: "./reuniones-form.component.css",
  standalone: true,
  imports: [
    CommonModule, PagetitleComponent, NgStepperModule, CdkStepperModule, FormsModule, BsDropdownModule,
    PuntosAgendaListComponent,
    AcuerdosListComponent,
    AcuerdosFormModalComponent,
    ParticipantesListComponent
],
})
export class ReunionesFormComponent {
  breadCrumbItems: Array<{}>;

  titleComponent: string;
  flagAction: number;
  idePagina: number;
}
