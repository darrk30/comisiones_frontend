import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { AccionesAcuerdoListComponent } from './components/revisiones-list/acciones-acuerdo-list.component';

const routes: Routes = [
 {
      path: "",
      component: AccionesAcuerdoListComponent
      // canActivate: [AdminGuard]

    },
    // {
    //   path: "crear/:idet", // id: ideEquipoTrabajo
    //   component: ReunionesFormComponent ,
    //   data: { title: 'REUNION - REGISTRAR', flagAction: 1 },
    //         // canActivate: [AdminGuard]

    // },
    // {
    //   path: "editar/:id",
    //   component: ReunionesFormComponent ,
    //   data: { title: 'REUNION - EDITAR', flagAction: 2 },
    //   // canActivate: [AdminGuard]
    // },
    // {
    //   path: "ver/:id",
    //   component: ReunionesFormComponent ,
    //   data: { title: 'REUNION - VER', flagAction: 3 },
    // },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RevisionesRoutingModule { }
