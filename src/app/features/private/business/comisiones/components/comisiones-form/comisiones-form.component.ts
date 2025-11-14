import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper'
import { PagetitleComponent } from "@/app/shared/components/pagetitle/pagetitle.component";

@Component({
  selector: 'app-comisiones-form',
  templateUrl: './comisiones-form.component.html',
  styleUrl: './comisiones-form.component.css',
  standalone: true,
  imports: [CommonModule,PagetitleComponent,CdkStepperModule,NgStepperModule]
})
export class ComisionesFormComponent {

 }
