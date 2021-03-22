import { Component, OnInit, OnChanges, Input } from '@angular/core';
import 'ol/ol.css';
import * as MapLib from './lib/map.js';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable, range } from 'rxjs';
import { geojson } from 'highcharts';
import { data } from 'jquery';
import { RecieveDataService } from 'src/app/home/data.service';
import { TempService } from 'src/app/services/data.service';
import { InputService } from "src/app/services/input.service";

interface DataRecieve {
  data:String
  file:String
  startYear:Number
  stopYear:Number
  startMonth:Number
  stopMonth:Number
  North:Number
  South:Number
  West:Number
  East:Number
  per:String
}

@Component({
  selector: 'app-netcdf',
  templateUrl: './netcdf.component.html',
  styleUrls: ['./netcdf.component.css'],
  providers: [TempService, RecieveDataService]
})
export class NetcdfComponent implements OnInit {
  data: string;
  index: string;
  startyear : string;
  start_date: string;
  stopyear: string;
  startmonth: string;
  stopmonth: string;
  per : string;
  North: number;
  South: number;
  West: number;
  East: number;

  hoveredDate: NgbDate | null = null;
  map: any;
  lowres_layer: any;
  hires_layer: any;

  long_name;
  difinition;
  unit;
  year;

  // public index;
  type;
  percent;
  value_db;
  Max;
  Min;
  color;
  lat_step;
  lon_step;
  datalayer;

  data_low;
  test;
  ranges;
  public recieveData:DataRecieve;

  getDataLayer(data,North,South,West,East,layername) {
    console.log("GetDataLayer")
    var lon = data[0]
    var lat = data[1]
    var value = data[2]
    console.log("value",value)
    var lon_step = data[5]
    var lat_step = data[6]
    var min_ =  data[3]
    var max_ = data[4]
    var color = data[7]
    var geojson = MapLib.merge_data_to_geojson(lon, lat, value, North,South,West,East,'value')
    var layer = MapLib.genGridData(
      geojson, min_, max_, color, lon_step, lat_step,'main', layername
    );
    return layer
  }

  getTrendLayer(data,North,South,West,East,layername) {
    var lon = data[0]
    var lat = data[1]
    var value = data[2]
    var lon_step = data[5]
    var lat_step = data[6]
    var min_ =  data[3]
    var max_ = data[4]
    var color = data[7]
    var geojson = MapLib.merge_data_to_geojson(lon, lat, value, North,South,West,East,'trend')
    var layer = MapLib.genGridData(
      geojson, min_, max_, color, lon_step, lat_step,'main', layername
    );
    return layer
  }

  constructor(
    public formatter: NgbDateParserFormatter,
    private tempService: TempService,
    private sharedData:InputService
  ) {}

  chooseyear1 = new FormGroup({
    fromyear1: new FormControl(),
    toyear1: new FormControl('', Validators.required)
  });
  chooseyear2 = new FormGroup({
    fromyear2: new FormControl('', Validators.required),
    toyear2: new FormControl('', Validators.required)
  });

  public lists: Array<string>
  ngOnInit() {
    this.test = 'test'
    this.map = MapLib.draw_map('map')
    // this.sharedData.sendValue("save data")
    console.log("datainput", this.data)
    console.log("North", this.North)
    // this.range_y= this.startyear +'-'+ this.startyear;
    function range(start, stop, step) {
      if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
      }
      if (typeof step == 'undefined') {
        step = 1;
      }
      if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
      }

      var result = [];
      for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
      }

      return result;
    };

    this.lists = range(1901, 2019, 1)
    // this.index = this.file

    this.sharedData.Detailservice.subscribe(data => {
      if(data){
        console.log("input Detail",data)
        this.unit = data.unit
        this.difinition = data.description
        this.long_name = data.long_name
        this.year = data.year
        console.log("unit",this.unit)
      }
      
    })
    
    // if (this.per != 'yes') {
    //   // this.map = MapLib.draw_map('map')

    //   await this.sharedData.regionservice.subscribe(data => {
    //     console.log("input region",data)
    //     this.North = data[0]
    //     this.South = data[1]
    //     this.West = data[2]
    //     this.East = data[3]
    //   })
      // await this.sharedData.lowresservice.subscribe(data => {
      //   console.log("input Lowres",data)
      //   this.data_low = data
      //   console.log(this.data_low)
      //   // this.lowres_layer = this.getDataLayer(this.data_low,this.North, this.South, this.West, this.East,'lowres_data')
      //   // MapLib.clearLayers(this.map);
      //   // this.map.getLayers().insertAt(0,this.lowres_layer);
      //   // // MapLib.setResolution(this.map,this.North, this.South, this.West, this.East)
      //   // MapLib.select_country(this.map)
      //   // MapLib.clearLayers(this.map);
        
      // })
      // this.lowres_layer = this.getDataLayer(this.data_low,this.North, this.South, this.West, this.East,'lowres_data')
      // await this.tempService.get_Avgcsv(this.data, this.index, this.startyear, this.stopyear,
      //   this.startmonth, this.stopmonth).then(data => data.subscribe(
      //     (res => { 
      //       console.log(">>>>>>>>>>",res)
      //       let resp = JSON.parse(res)
      //       this.data_lowres = resp
      //     // get layer for add to map
      //       this.lowres_layer = this.getDataLayer(resp,this.North, this.South, this.West, this.East,'lowres_data')
      //       MapLib.clearLayers(this.map);
      //       this.map.getLayers().insertAt(0,this.lowres_layer);
      //       // MapLib.setResolution(this.map,this.North, this.South, this.West, this.East)
      //       MapLib.select_country(this.map)
      //       MapLib.clearLayers(this.map);
      //       // MapLib.hightre(this.map)
      //       // this.map.getView().setCenter([115, 5])
      //     })
      //   ))
      
      // await this.tempService.get_hire(this.data, this.index, this.startyear, this.stopyear,
      //   this.startmonth, this.stopmonth).then(data => data.subscribe(
      //     (res => { 
      //       // console.log(">>>>>>>>>>",res)
      //       let resp = JSON.parse(res)
      //       this.hires_layer = this.getDataLayer(resp,this.North, this.South, this.West, this.East,'hires_data')
      //       // MapLib.clearLayers(this.map);
      //       this.map.getLayers().insertAt(0,this.hires_layer);
      //       MapLib.setResolution(this.map)

          
      //     })
      //   ))
        // }

    if (this.per != 'yes') {
      // this.plot(this.data,this.index)
      this.plot_ser()
    }
  }

  async plot_ser(){
    this.sharedData.regionservice.subscribe(data => {
      console.log("input region",data)
      this.North = data[0]
      this.South = data[1]
      this.West = data[2]
      this.East = data[3]
    })

    this.sharedData.lowresservice.subscribe(data => {
      if(data){
        console.log("input Lowres",data)
        this.data_low = data
        this.lowres_layer = this.getDataLayer(this.data_low,this.North, this.South, this.West, this.East,'lowres_data')
        MapLib.clearLayers(this.map);
        this.map.getLayers().insertAt(0,this.lowres_layer);
        // MapLib.setResolution(this.map,this.North, this.South, this.West, this.East)
        // MapLib.select_country(this.map)
        // MapLib.clearLayers(this.map);
      }
    })

    this.sharedData.hiresservice.subscribe(data => {
      if(data){
        console.log("input Hires",data)
        // this.data_hire = data
        this.hires_layer = this.getDataLayer(data,this.North, this.South, this.West, this.East,'hires_data')
        // MapLib.clearLayers(this.map);
        this.map.getLayers().insertAt(0,this.hires_layer);
        // MapLib.setResolution(this.map,this.North, this.South, this.West, this.East)
        MapLib.select_country(this.map)
        MapLib.setResolution(this.map)
        // MapLib.clearLayers(this.map);
      }
    })
  }

// -----------read npz USE!!!!!!!!!!--------------------------------
  async plot(dataset,index) {
    // this.plot_per()
    this.map = MapLib.draw_map('map')
    // MapLib.add_graticule_layer(this.map)
    console.log("dat", this.index)
    console.log(this.chooseyear1.controls['fromyear1'].value)
    console.log("plot")
    this.percent = "Work"
    console.time()
 
    let v
    let L = []

    await this.tempService.get_detail(dataset, index).then(data => data.subscribe(res => {
      this.color = JSON.parse(res)
      this.color = this.color[0]['color_map']
      console.log(this.color)
    }))
    
    await this.tempService.get_Avgcsv(dataset, index, this.startyear, this.stopyear,
      this.startmonth, this.stopmonth).then(data => data.subscribe(
        (res => { 
          // console.log(">>>>>>>>>>",res)
          let resp = JSON.parse(res)
          console.log(">>>>>>>>>",resp)
          // console.log(">>>>>>>>>",resp[3])
          var val = resp[2]
          for (v in val) {
            data = val[v]
            L.push(data)
          }
          console.log('res', L)
          console.log('min', resp[3])
         
          const geojson = MapLib.merge_data_to_geojson(resp[0],resp[1], val, this.North, this.South, this.West, this.East);
          this.datalayer = MapLib.genGridData(geojson, resp[3], resp[4], resp[7], resp[5], resp[6],'main','lowres_data');
          // this.selectgrid = MapLib.gridselect(geojson)
          MapLib.clearLayers(this.map);
          this.map.getLayers().insertAt(0,this.datalayer);
          // this.map.addLayer(this.datalayer)
          MapLib.select_country(this.map)
          // MapLib.select_c(this.map)
          console.log("finish")
          console.timeEnd()

        }
        )))
  }

}