import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GraphComponent } from './graph/graph.component';
import { MapComponent } from './map/map.component';
import { SelectplotComponent } from './components/selectplot.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TestfunctionComponent } from './testfunction/testfunction.component';
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
import { HomeComponent } from './home/home.component';
import { MockComponent } from './mock/mock.component';
// import { SharedModule, PanelModule } from 'primeng/primeng';
import { TempService } from './services/temp.service'
import { PopUpService } from './services/pop-up.service'
import { MarkerService } from './services/markers.service'
import {LeafletModule} from '@asymmetrik/ngx-leaflet';

import { 
	IgxDropDownModule,
	IgxButtonModule,
	IgxSwitchModule,
	IgxToggleModule
 } from "igniteui-angular";
// import { DropDownSample5Component } from "./dropdown-sample-5/dropdown-sample-5.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    GraphComponent,
    SelectplotComponent,
    TestfunctionComponent,
    MissingvalueComponent,
    BoxplotComponent,
    NetcdfComponent,
    HomeComponent,
    MockComponent
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
    LeafletModule

  ],
  providers: [PopUpService,MarkerService],
  bootstrap: [AppComponent]
})
export class AppModule { }