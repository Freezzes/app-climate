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
import { PlotlyComponent } from './plotly/plotly.component';

@NgModule({
  declarations: [
    AppComponent,
    TempComponent,
    TasksComponent,
    PlotComponent,
    PlotlyComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    HttpClientModule,    
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }