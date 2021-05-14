import { Component, OnInit, OnChanges } from '@angular/core';
import 'ol/ol.css';
import * as MapLib from 'src/app/netcdf/lib/map.js';
import { DataService } from 'src/app/services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { InputService } from "src/app/services/input.service";

@Component({
  selector: 'app-difference',
  templateUrl: './difference.component.html',
  styleUrls: ['./difference.component.css']
})
export class DifferenceComponent implements OnInit {

  public lists: any;
  public map: any;
  public map1: any;
  public map2: any;
  public dataset: any;
  public index: any;
  public start1: any;
  public stop1: any;
  public start2: any;
  public stop2: any;

  min1;
  max1;

  North;
  South;
  West;
  East;

  long_name;
  difinition;
  unit;
  color_map;
  year;
  public details: any;
  Clear;
  ClearYear;
  Ranges;
  Ranges2;
  dataset_name;

  Input: any;

  constructor(
    public formatter: NgbDateParserFormatter,
    private dataService: DataService,
    private sharedData: InputService
  ) { }

  chooseyear1 = new FormGroup({
    fromyear1: new FormControl(),
    toyear1: new FormControl('', Validators.required)
  });

  chooseyear2 = new FormGroup({
    fromyear2: new FormControl('', Validators.required),
    toyear2: new FormControl('', Validators.required)
  });

  getDataLayer(data, North, South, West, East, layername, name_legend, type, color, unit,long_name) {
    var lon = data[0]
    var lat = data[1]
    var value = data[2]
    var lon_step = data[5]
    var lat_step = data[6]
    var min_ = data[3]
    var max_ = data[4]
    var color = color
    var unit = unit
    var long_name = long_name
    var geojson = MapLib.convert_to_geojson(value, lon, lat)
    var merge = MapLib.merge_data_to_geojson(geojson, value, North, South, West, East, 'value')
    var layer = MapLib.genGridData(
      merge, min_, max_, color, unit, lon_step, lat_step, type, layername, name_legend,long_name);
    return layer
  }

  ngOnInit(): void {
    this.map1 = MapLib.draw_map('map1')
    this.map2 = MapLib.draw_map('map2')
    this.map = MapLib.draw_map('dif')
    
    this.sharedData.Detailservice.subscribe(data => {
      if (data) {
        console.log("input Detail", data)
        this.unit = data[0].unit
        this.difinition = data[0].description
        this.long_name = data[0].long_name
        this.color_map = data[0].color_map
        this.year = data[0].year
        var start = data[0].year.split("-")[0]
        var stop = data[0].year.split("-")[1]
        this.index = data[2]
        this.dataset = data[1]
        this.Range(start, stop)
        this.clear()
        this.chooseyear1.patchValue({
          fromyear1: null,
          toyear1: null
        })
        this.chooseyear2.patchValue({
          fromyear2: null,
          toyear2: null
        })
      }
    })

    this.sharedData.difservice.subscribe(data => {
      if (data) {
        console.log("input dif", data)
        this.Input = data[0]
      }
    })

    this.sharedData.regionservice.subscribe(data => {
      if (data) {
        console.log("input region", data)
        this.North = data[0]
        this.South = data[1]
        this.West = data[2]
        this.East = data[3]
      }
    })
  }

  async clear() {
    this.Clear = 'clear'
    this.ClearYear = 'clear'
    console.log(this.ClearYear)
    MapLib.clearLayers(this.map1);
    MapLib.clearLayers(this.map2);
    MapLib.clearLayers(this.map);
  }
  async Range(x, y) {
    var start_y = Number(x)
    var stop_y = Number(y)
    function counter(start: number, stop: number) {
      var result = [];
      for (var i = start; 1 > 0 ? i < stop : i > stop; i += 1) {
        result.push(i)
      }
      return result;
    }
    this.lists = counter(start_y, stop_y + 1)
  }

  async per_different() {
    this.Clear = 'show'
    this.start1 = this.chooseyear1.controls['fromyear1'].value
    this.stop1 = this.chooseyear1.controls['toyear1'].value
    this.start2 = this.chooseyear2.controls['fromyear2'].value
    this.stop2 = this.chooseyear2.controls['toyear2'].value
    await this.dataService.per_dif(this.Input.dataset, this.Input.index, this.start1, this.stop1, this.start2, this.stop2, this.Input.rcp, this.Input.types).then(data => data.subscribe(
      (res => {
        let resp = JSON.parse(res)
        const data_dif = this.getDataLayer(resp, this.North, this.South, this.West, this.East, 'lowres_data', 'mapdif', 'per', this.color_map, this.unit,this.long_name)
        MapLib.clearLayers(this.map);
        this.map.getLayers().insertAt(0, data_dif);
        MapLib.select_country(this.map)
      })
    ))
  }

  async raw_different() {
    this.Clear = 'show'
    console.time()
    this.start1 = this.chooseyear1.controls['fromyear1'].value
    this.stop1 = this.chooseyear1.controls['toyear1'].value
    this.start2 = this.chooseyear2.controls['fromyear2'].value
    this.stop2 = this.chooseyear2.controls['toyear2'].value

    await this.dataService.raw_dif(this.Input.dataset, this.Input.index, this.start1, this.stop1, this.start2, this.stop2, this.Input.rcp, this.Input.types).then(data => data.subscribe(
      (res => {
        let resp = JSON.parse(res)
        console.log(">>>>>>>>>", resp)
        // const geojson = MapLib.merge_data_to_geojson(resp[0],resp[1], val, this.North, this.South, this.West, this.East,'value');
        // console.log("geojson",geojson)
        // var datalayer = MapLib.genGridData(geojson, resp[3], resp[4], resp[7], resp[5], resp[6],'main','lowres_data');
        const data_dif = this.getDataLayer(resp, this.North, this.South, this.West, this.East, 'lowres_data', 'mapdif', 'main', this.color_map, this.unit,this.long_name)
        MapLib.clearLayers(this.map);
        this.map.getLayers().insertAt(0, data_dif);
        MapLib.select_country(this.map)
        console.log("finish")
        console.timeEnd()

      })
    ))
  }

  async maprcp_range1() {
    this.Clear = 'show'
    this.start1 = this.chooseyear1.controls['fromyear1'].value
    this.stop1 = this.chooseyear1.controls['toyear1'].value
    this.Ranges = 'Year ' + this.start1 + '-' + this.stop1
    await this.dataService.map_range1(this.Input.dataset, this.Input.index, this.start1, this.stop1, this.Input.rcp, this.Input.types).then(data => data.subscribe(
      (res => {
        let resp = JSON.parse(res)
        this.min1 = resp[3]
        this.max1 = resp[4]
        const data_dif = this.getDataLayer(resp, this.North, this.South, this.West, this.East, 'lowres_data', 'map1', 'main', this.color_map, this.unit,this.long_name)
        MapLib.clearLayers(this.map1);
        this.map1.getLayers().insertAt(0, data_dif);
        MapLib.select_country(this.map1)
      })
    ))
  }

  async maprcp_range2() {
    this.Clear = 'show'
    this.start2 = this.chooseyear2.controls['fromyear2'].value
    this.stop2 = this.chooseyear2.controls['toyear2'].value
    this.Ranges2 = 'Year ' + this.start2 + '-' + this.stop2
    await this.dataService.map_range2(this.Input.dataset, this.Input.index, this.start1, this.stop1, this.Input.rcp, this.Input.types).then(data => data.subscribe(
      (res => {
        let resp = JSON.parse(res)
        var value = resp[2]
        var geojson = MapLib.convert_to_geojson(value, resp[0], resp[1],)
        var merge = MapLib.merge_data_to_geojson(geojson, value, this.North, this.South, this.West, this.East, 'value')
        const datalayer2 = MapLib.genGridData(merge, this.min1, this.max1, this.color_map, this.unit, resp[5], resp[6], 'main', 'lowres_data', 'map2');
        MapLib.clearLayers(this.map2);
        this.map2.getLayers().insertAt(0, datalayer2);
        MapLib.select_country(this.map2)
      })
    ))
  }

}

