import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../services/data.service';
import 'ol/ol.css';
import * as MapLib1 from './lib/mapthai.js';
import * as MapLib from './lib/map_station.js';
import { useGeographic } from 'ol/proj';
import { Router, ActivatedRoute } from '@angular/router';
import { InputService } from 'src/app/services/input.service';


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
  layer: any;

  constructor(private dataService: DataService, private router: Router,private sharedData: InputService) {
  }

  capitals: string = '../../assets/station_input.geojson';

  async ngOnInit() {
    this.map = MapLib.draw_map('map')

    // await this.dataService.getdata_sta(this.file, this.startyear, this.stopyear,
    //   this.startmonth, this.stopmonth).then(res => {
    //     res.subscribe(datas => {
    //       // console.log(datas)
    //       this.map = MapLib2.map_station(datas)

    //     })

    //   })

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

    //  this.map.on('dblclick', (evt) => {
    //     // const feature = this.map.forEachFeatureAtPixel(evt.pixel, (feat, layer) => {
    //     //   // you can add a condition on layer to restrict the listener
    //     //   return feat;
    //     // });
    //     console.log("dbclick")
    //     var names = this.map.forEachFeatureAtPixel(evt.pixel, function(feature) {
    //       return feature.get('names');
    //     })

    //     if (names) {
    //       this.router.navigateByUrl('/mock');
    //     }
    //   });
  }

}



