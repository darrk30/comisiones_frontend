
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

	{
		path: 'demo',
		loadChildren: () => import('./demos/demos.module').then(m => m.DemosModule),
		canActivate: []
	},
  {
		path: 'comision',
		loadChildren: () => import('./comisiones/comisiones.module').then(m => m.ComisionesModule),
		canActivate: []
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
