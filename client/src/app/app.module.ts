import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GraphComponent } from './graph/graph.component';
import { MapComponent } from './map/map.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { from } from 'rxjs';
import { HighchartsChartModule } from 'highcharts-angular';
import { HIGHCHARTS_MODULES, ChartModule } from 'angular-highcharts';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NetcdfComponent } from './netcdf/netcdf.component';
import { HomeComponent } from './home/home.component';
import { MockComponent } from './mock/mock.component';
// import { SharedModule, PanelModule } from 'primeng/primeng';
import { DataService } from './services/data.service'


import { 
	IgxDropDownModule,
	IgxButtonModule,
	IgxSwitchModule,
	IgxToggleModule
 } from "igniteui-angular";
// import { DropDownSample5Component } from "./dropdown-sample-5/dropdown-sample-5.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DifferenceComponent } from './difference/difference.component';


PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    GraphComponent,
    NetcdfComponent,
    HomeComponent,
    MockComponent,
    NetcdfComponent,
    DifferenceComponent
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
    IgxDropDownModule,
    IgxButtonModule,
    IgxSwitchModule,
    IgxToggleModule,
    BrowserAnimationsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }