import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraphComponent } from '../app/components/graph.component';
import { MapComponent } from '../app/components/map.component';
import { SelectplotComponent } from '../app/components/selectplot.component';

const routes: Routes = [
  { path: 'plot', component: GraphComponent },
  { path: 'temp', component: MapComponent },
  { path: 'select', component: SelectplotComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
