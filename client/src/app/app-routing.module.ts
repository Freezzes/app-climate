import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraphComponent } from '../app/components/graph.component';
import { MapComponent } from '../app/components/map.component';
import {MixedChartComponent} from '../app/components/mixed-chart/mixed-chart.component';
import { BoxplotComponent } from '../app/components/boxplot/boxplot.component';
// import { MapAreaComponent } from '../app/components/map-area.component';

const routes: Routes = [
  { path: 'graph', component: GraphComponent },
  { path: 'map', component: MapComponent },
  { path: 'test', component:MixedChartComponent },
  { path: 'boxplot', component:BoxplotComponent },
  // { path: 'maparea', component:MapAreaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
