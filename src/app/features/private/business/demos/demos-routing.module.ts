import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemosListComponent } from './components/demos-list/demos-list.component';

const routes: Routes = [
  	{ 
        path: "", 
        component: DemosListComponent,
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemosRoutingModule { }
