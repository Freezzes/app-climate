import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlotComponent } from '../app/plot/plot.component';
import { TempComponent } from '../app/temp/temp.component';
import { MapComponent } from '../app/map/map.component';

const routes: Routes = [
  { path: 'plot', component: PlotComponent },
  { path: 'temp', component: TempComponent },
  { path: 'map', component: MapComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
