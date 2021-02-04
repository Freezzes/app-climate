import { Component, OnInit ,AfterViewInit } from '@angular/core';
import { TempService } from '../services/temp.service';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import * as L from 'leaflet';
import { latLng, MapOptions, tileLayer, Marker, icon } from 'leaflet';
import { MarkerService } from '../services/markers.service';
import 'ol/ol.css';
import * as MapLib from './lib/mapthai.js';
import * as MapLib2 from './lib/map_station.js';
import {Circle, Fill, Style} from 'ol/style';
import {Feature, Map, Overlay, View} from 'ol/index';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Point} from 'ol/geom';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {useGeographic} from 'ol/proj';
import * as $ from 'jquery'

useGeographic();

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [TempService]
})

export class MapComponent implements OnInit {

  map: any;
  popup: any;
  datas

  constructor(private tempService: TempService) {
  }

  capitals: string = '../../assets/station_input.geojson';

  ngOnInit() {
    console.log("on")
    // MapLib.mapthai()
    this.tempService.getdata_sta().subscribe(res => {
      MapLib2.map_sta(res)

      console.log("map result : ",res)
  })
}
 
}