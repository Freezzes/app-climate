import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraphComponent } from '../app/components/graph.component';
import { MapComponent } from '../app/components/map.component';

const routes: Routes = [
  { path: 'graph', component: GraphComponent },
  { path: 'map', component: MapComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
