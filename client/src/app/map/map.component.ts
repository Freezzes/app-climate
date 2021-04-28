import { Component, OnInit , Input} from '@angular/core';
import { DataService } from '../services/data.service';
import 'ol/ol.css';
import * as MapLib from './lib/mapthai.js';
import * as MapLib2 from './lib/map_station.js';
import {Circle, Fill, Style} from 'ol/style';
import {Feature, Map, Overlay, View} from 'ol/index';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Point} from 'ol/geom';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {useGeographic} from 'ol/proj';
import { Router, ActivatedRoute } from '@angular/router';


useGeographic();

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [DataService]
})

export class MapComponent implements OnInit {
  @Input() file: string;
  @Input() startyear: string;
  @Input() stopyear: string;
  @Input() startmonth: string;
  @Input() stopmonth: string;
  map: any;
  popup: any;

  constructor(private dataService: DataService,private router: Router) {
  }

  capitals: string = '../../assets/station_input.geojson';

  async ngOnInit() {
    console.log("on")
    console.log("file",this.file)
    // MapLib.mapthai()
    // await this.tempService.getdata_sta(this.data).then(res => {
    //   // MapLib2.map_sta(res)
    //   console.log("map",res)
    await this.dataService.getdata_sta(this.file,this.startyear,this.stopyear,
      this.startmonth,this.stopmonth).then(res => {
      res.subscribe(datas => {
        // console.log(datas)
        this.map = MapLib2.map_sta(datas)
    this.map = MapLib.draw_map('map')
    await this.sharedData.Mapstationservice.subscribe(data => {
      console.log("map station :",data)
      if(data){
        
        var icon = MapLib.add_data(data)
        MapLib.clearLayers(this.map)
        this.map.addLayer(icon)
        MapLib.popup(this.map)
     
        console.log(this.map.getLayers())
   
        
      }
    })
  }
 
}



