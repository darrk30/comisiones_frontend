import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { ComisionesListComponent } from './components/comisiones-list/comisiones-list.component';
import { ComisionesFormComponent } from './components/comisiones-form/comisiones-form.component';
import { NegocioGuard } from '@/app/core/guards/negocio-guard';

const routes: Routes = [
 {
      path: "",
      component: ComisionesListComponent,
      canActivate: [NegocioGuard]

    },
    {
      path: "crear",
      component: ComisionesFormComponent ,
      data: { title: 'ÓRGANO - REGISTRAR', flagAction: 1 },
      canActivate: [NegocioGuard]


    },
    {
      path: "editar/:id",
      component: ComisionesFormComponent ,
      data: { title: 'ÓRGANO - EDITAR', flagAction: 2 },
      canActivate: [NegocioGuard]

    },
    {
      path: "ver/:id",
      component: ComisionesFormComponent ,
      data: { title: 'ÓRGANO - VER', flagAction: 3 },
      canActivate: [NegocioGuard]

    },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComisionesRoutingModule { }
