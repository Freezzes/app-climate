import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlotComponent } from '../app/plot/plot.component';
import { TempComponent } from '../app/temp/temp.component';

const routes: Routes = [
  { path: 'plot', component: PlotComponent },
  { path: 'temp', component: TempComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
