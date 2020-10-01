import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GraphComponent } from '../app/components/graph.component';
import { MapComponent } from '../app/components/map.component';
import { LeafletModule} from '@asymmetrik/ngx-leaflet';

import { MarkerService } from './services/markers.service';
import { BoxplotComponent } from './components/boxplot/boxplot.component';
// import { MapAreaComponent } from './components/map-area.component';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { MixedChartComponent } from './components/mixed-chart/mixed-chart.component';
import { ChartsModule } from 'ng2-charts';
import { from } from 'rxjs';
import { MapAreaComponent } from '../app/components/map-area.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { NetcdfComponent } from './components/netcdf/netcdf.component';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    GraphComponent,
    BoxplotComponent,
    MixedChartComponent,
    MapAreaComponent,
    NetcdfComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    HttpClientModule,    
    AppRoutingModule,
    LeafletModule,
    PlotlyModule,
    ChartsModule,
    HighchartsChartModule
  ],
  providers: [MarkerService],
  bootstrap: [AppComponent]
})
export class AppModule { }