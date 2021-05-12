import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';
import { MissingvalueComponent } from './missingvalue/missingvalue.component';
import { BoxplotComponent } from './boxplot/boxplot.component';
import { NetcdfComponent } from './netcdf/netcdf.component';
import { NetcdfgraphComponent } from './netcdfgraph/netcdfgraph.component';
import { from } from 'rxjs';
import { HomeComponent } from './home/home.component';
const routes: Routes = [
  { path: 'map', component: MapComponent },
  { path: 'missingvalue', component: MissingvalueComponent },
  { path: 'boxplot', component:BoxplotComponent},
  { path: '', component:HomeComponent},
  { path: 'netcdf', component:NetcdfComponent},
  { path: 'netcdfgraph', component:NetcdfgraphComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
