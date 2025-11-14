import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemosRoutingModule } from './demos-routing.module';
import { DemosListComponent } from './components/demos-list/demos-list.component';
import { DemosFormComponent } from './components/demos-form/demos-form.component';
import { DemosFormModalComponent } from './components/demos-form-modal/demos-form-modal.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    DemosRoutingModule
  ]
})
export class DemosModule { }
