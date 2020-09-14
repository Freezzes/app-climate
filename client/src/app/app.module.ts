import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GraphComponent } from '../app/components/graph.component';
import { MapComponent } from '../app/components/map.component';
// import { LeafletModule} from '@asymmetrik/ngx-leaflet';

import { MarkerService } from './services/markers.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    GraphComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    HttpClientModule,    
    AppRoutingModule,
    // LeafletModule
  ],
  providers: [MarkerService],
  bootstrap: [AppComponent]
})
export class AppModule { }