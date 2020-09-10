import { Component, OnInit } from '@angular/core'
import { Temp } from './temp'
import { TempsService } from './temp.service'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import * as L from 'leaflet';
import {latLng, MapOptions, tileLayer, Map, Marker, icon} from 'leaflet';

@Component({
    selector: 'app-temp',
    templateUrl: './temp.component.html',
    styleUrls: ['./temp.component.css'],
    providers: [TempsService]
})

export class TempComponent implements OnInit {

    map: Map;
    mapOptions: MapOptions;
    namesta = 'กรุงเทพ'
  
    constructor() {
    }
  
    ngOnInit() {
      this.initializeMapOptions();
    }
  
    onMapReady(map: Map) {
      this.map = map;
      // this.addSampleMarker();
      //this.markerdata();
    }
  
    private initializeMapOptions() {
      this.mapOptions = {
        center: latLng(20, 100),
        zoom: 5,
        layers: [
          tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
              maxZoom: 18,
              attribution: 'Map data © OpenStreetMap contributors'
            })
        ],
      };
    }
  
    private addSampleMarker() {
      const marker = new Marker([13.72638889, 100.56])
        .setIcon(
          icon({
            iconSize: [20, 30],
            iconAnchor: [13, 41],
            iconUrl: 'assets/marker-icon.png'
          }));
      marker.addTo(this.map);
    }
  
    // private markerdata(){
    //   const geojsonLayer = new L.geoJSON.ajax('station_input.geojson').addTo(this.map)
    // }
  
  }