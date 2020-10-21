import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GraphComponent } from '../app/components/graph.component';
import { MapComponent } from '../app/components/map.component';
import { SelectplotComponent } from './components/selectplot.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TestfunctionComponent } from './components/testfunction.component';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MissingvalueComponent } from './missingvalue/missingvalue.component';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { from } from 'rxjs';
import { HighchartsChartModule } from 'highcharts-angular';
import { HIGHCHARTS_MODULES, ChartModule } from 'angular-highcharts';
import { BoxplotComponent } from './boxplot/boxplot.component';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    GraphComponent,
    SelectplotComponent,
    TestfunctionComponent,
    MissingvalueComponent,
    BoxplotComponent
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
    ChartModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }