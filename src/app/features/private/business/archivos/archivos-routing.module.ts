import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchivosListComponent } from './components/archivos-list/archivos-list.component';


const routes: Routes = [
  { 
      path: "", 
      component: ArchivosListComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchivosRoutingModule { }
