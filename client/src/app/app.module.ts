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


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    GraphComponent,
    SelectplotComponent,
    TestfunctionComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    HttpClientModule,    
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }