import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { ComisionesListComponent } from './components/comisiones-list/comisiones-list.component';
import { ComisionesFormComponent } from './components/comisiones-form/comisiones-form.component';

const routes: Routes = [
 {
      path: "",
      component: ComisionesListComponent,
      // canActivate: [AdminGuard]

    },
    {
      path: "crear",
      component: ComisionesFormComponent ,
      data: { title: 'COMISION - REGISTRAR', flagAction: 1 },
            // canActivate: [AdminGuard]

    },
    {
      path: "editar/:id",
      component: ComisionesFormComponent ,
      data: { title: 'COMISION - EDITAR', flagAction: 2 },
      // canActivate: [AdminGuard]
    },
    {
      path: "ver/:id",
      component: ComisionesFormComponent ,
      data: { title: 'COMISION - VER', flagAction: 3 },
    },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComisionesRoutingModule { }
