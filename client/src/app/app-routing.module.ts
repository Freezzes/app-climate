import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraphComponent } from './graph/graph.component';
import { MapComponent } from './map/map.component';
import { SelectplotComponent } from '../app/components/selectplot.component';
import { TestfunctionComponent } from './testfunction/testfunction.component';
import { MissingvalueComponent } from './missingvalue/missingvalue.component';
import { BoxplotComponent } from './boxplot/boxplot.component';
import { NetcdfComponent } from './netcdf/netcdf.component';
import { from } from 'rxjs';

const routes: Routes = [
  { path: 'plot', component: GraphComponent },
  { path: 'map', component: MapComponent },
  { path: 'select', component: SelectplotComponent },
  { path: 'testfunction', component: TestfunctionComponent},
  { path: 'missingvalue', component: MissingvalueComponent },
  { path: 'boxplot', component:BoxplotComponent},
  { path: '', component:NetcdfComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
