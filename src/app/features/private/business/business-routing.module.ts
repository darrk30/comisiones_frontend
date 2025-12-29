
import { NegocioGuard } from '@/app/core/guards/negocio-guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
		path: 'comision',
		loadChildren: () => import('./comisiones/comisiones.module').then(m => m.ComisionesModule),
		canActivate: [NegocioGuard]
	},
  {
		path: 'reunion',
		loadChildren: () => import('./reuniones/reuniones.module').then(m => m.ReunionesModule),
		canActivate: [NegocioGuard]
	},
  {
		path: 'revision',
		loadChildren: () => import('./revisiones/revisiones.module').then(m => m.RevisionesModule),
		canActivate: [NegocioGuard]
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
