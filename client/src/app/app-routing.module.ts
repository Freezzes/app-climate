import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraphComponent } from './graph/graph.component';
import { MapComponent } from './map/map.component';
import { NetcdfComponent } from './netcdf/netcdf.component';
import { HomeComponent } from './home/home.component';
import { MockComponent} from './mock/mock.component';
import { from } from 'rxjs';

const routes: Routes = [
  { path: 'plot', component: GraphComponent },
  // { path: 'map', component: MapComponent },
  // { path: 'nc', component:NetcdfComponent},
  { path: '', component:HomeComponent, children:[
    { path: 'nc', component:NetcdfComponent},
    { path: 'map', component: MapComponent }
  ]},
  { path: 'mock', component: MockComponent},
  // { path: '',   redirectTo: '', pathMatch: 'full' },
];

// export const routes: Routes = [
//   // { path: '', component: HomeComponent,
//   //   // redirectTo: '/home',
//   //   pathMatch: 'full'
//   // },
//   // { path: 'home', component: HomeComponent}, 
//   { path: 'map', component: NetcdfComponent },
//   { path: 'station', component: MapComponent }
// ];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
