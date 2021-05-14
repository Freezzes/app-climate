import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MapComponent } from './map/map.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MissingvalueComponent } from './missingvalue/missingvalue.component';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { from } from 'rxjs';
import { HighchartsChartModule } from 'highcharts-angular';
import { HIGHCHARTS_MODULES, ChartModule } from 'angular-highcharts';
import { BoxplotComponent } from './boxplot/boxplot.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NetcdfComponent } from './netcdf/netcdf.component';
import {MatRadioModule} from '@angular/material/radio';
import { HomeComponent } from './home/home.component';
import { NetcdfgraphComponent } from './netcdfgraph/netcdfgraph.component';
import { DifferenceComponent } from './difference/difference.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MissingvalueComponent,
    BoxplotComponent,
    NetcdfComponent,
    HomeComponent,
    NetcdfgraphComponent,
    DifferenceComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    HttpClientModule,    
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    PlotlyModule,
    HighchartsChartModule,
    ChartModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatRadioModule,
    NgxSpinnerModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }