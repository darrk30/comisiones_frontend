import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { ReunionesFormComponent } from './components/reuniones-form/reuniones-form.component';
import { ReunionesListComponent } from './components/reuniones-list/reuniones-list.component';

const routes: Routes = [
 {
      path: "",
      component: ReunionesListComponent
      // canActivate: [AdminGuard]

    },
    {
      path: "crear",
      component: ReunionesFormComponent ,
      data: { title: 'REUNION - REGISTRAR', flagAction: 1 },
            // canActivate: [AdminGuard]

    },
    {
      path: "editar/:id",
      component: ReunionesFormComponent ,
      data: { title: 'REUNION - EDITAR', flagAction: 2 },
      // canActivate: [AdminGuard]
    },
    {
      path: "ver/:id",
      component: ReunionesFormComponent ,
      data: { title: 'REUNION - VER', flagAction: 3 },
    },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReunionesRoutingModule { }
