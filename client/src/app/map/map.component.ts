import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import * as L from 'leaflet';
import {latLng, MapOptions, tileLayer, Map, Marker, icon} from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [MapService]
})
export class MapComponent implements OnInit {

  constructor(
    private mapService: MapService) { }

  mapOptions: MapOptions;

  ngOnInit(): void {
    // this.initializeMapOptions();
    // var mymap = L.map('mapid').setView([51.505, -0.09], 13);
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

}
