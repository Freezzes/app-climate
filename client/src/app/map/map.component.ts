import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { TempService } from '../services/temp.service';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import 'ol/ol.css';
import * as MapLib from './lib/map_station.js';
import { Circle, Fill, Style } from 'ol/style';
import { Feature, Map, Overlay, View } from 'ol/index';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';
import * as $ from 'jquery'
import { Router, ActivatedRoute } from '@angular/router';
import { InputService } from 'src/app/services/input.service';

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
  datas = ''
  public checkplot = '';

  @Input() file: string;
  @Input() start_date: String;
  @Input() stop_date: String;


  constructor(private tempService: TempService, private router: Router,private sharedData: InputService,) {
  }

  capitals: string = '../../assets/station_input.geojson';

  async ngOnInit() {
    console.log("on")
    console.log("file : ", this.file)
    console.log("DATE : ", this.start_date, this.stop_date)
    this.map = MapLib.draw_map('map')

    await this.sharedData.Mapstationservice.subscribe(data => {
      console.log("map station :",data)
      if(data){
        var icon = MapLib.add_data(data)
        MapLib.clearLayers(this.map)
        this.map.addLayer(icon)
        MapLib.popup(this.map)
        console.log("pop up",icon)
      }
    })
  }

}