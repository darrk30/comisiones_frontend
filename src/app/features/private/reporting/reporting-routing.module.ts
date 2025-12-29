import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './dashboard/components/principal/principal.component';
import { ComisionesReportComponent } from './comisiones/components/comisiones-list/comisiones-report.component';

const routes: Routes = [
	{
		path: "",
		// component: PrincipalComponent
		// component: ComisionesReportComponent
    redirectTo: 'comision',
    pathMatch: 'full'
	},
  {
		path: "comision",
		component:  ComisionesReportComponent
	},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule { }
