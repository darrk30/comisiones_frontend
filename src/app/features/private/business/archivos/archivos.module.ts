import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArchivosRoutingModule } from './archivos-routing.module';
import { ArchivosListComponent } from './components/archivos-list/archivos-list.component';
import { ArchivosFormModalComponent } from './components/archivos-form-modal/archivos-form-modal.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ArchivosRoutingModule
  ]
})
export class ArchivosModule { }
