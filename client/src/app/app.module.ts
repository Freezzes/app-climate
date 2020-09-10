import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TasksComponent } from './task/tasks.component'
import { TempComponent } from './temp/temp.component';
import { PlotComponent } from './plot/plot.component';
import { LeafletModule} from '@asymmetrik/ngx-leaflet';

import { MarkerService } from './services/markers.service';
import { MapComponent } from './map/map.component';


@NgModule({
  declarations: [
    AppComponent,
    TempComponent,
    TasksComponent,
    PlotComponent,
    MapComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    HttpClientModule,    
    AppRoutingModule,
    LeafletModule
  ],
  providers: [MarkerService],
  bootstrap: [AppComponent]
})
export class AppModule { }