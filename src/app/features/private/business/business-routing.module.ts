
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
		path: 'comision',
		loadChildren: () => import('./comisiones/comisiones.module').then(m => m.ComisionesModule),
		canActivate: []
	},
  {
		path: 'reunion',
		loadChildren: () => import('./reuniones/reuniones.module').then(m => m.ReunionesModule),
		canActivate: []
	},
  {
		path: 'revision',
		loadChildren: () => import('./revisiones/revisiones.module').then(m => m.RevisionesModule),
		canActivate: []
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
