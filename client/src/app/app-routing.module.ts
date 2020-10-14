import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraphComponent } from '../app/components/graph.component';
import { MapComponent } from '../app/components/map.component';
import { SelectplotComponent } from '../app/components/selectplot.component';
import { TestfunctionComponent } from '../app/components/testfunction.component';
import { MissingvalueComponent } from './missingvalue/missingvalue.component';
const routes: Routes = [
  { path: 'plot', component: GraphComponent },
  { path: 'temp', component: MapComponent },
  { path: 'select', component: SelectplotComponent },
  { path: 'testfunction', component: TestfunctionComponent},
  { path: 'missingvalue', component: MissingvalueComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
