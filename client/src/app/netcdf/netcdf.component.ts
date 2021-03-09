import { Component, OnInit, OnChanges, Input } from '@angular/core';
import 'ol/ol.css';
import * as MapLib from './lib/map.js';
import { NC_csv, st } from '../interfaces/temp.interface'
import { TempService } from 'src/app/services/temp.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable, range } from 'rxjs';
import { geojson } from 'highcharts';
import { data } from 'jquery';
import { RecieveDataService } from 'src/app/home/data.service';

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
  @Input() data: string;
  @Input() file: string;
  @Input() startyear: string;
  @Input() start_date: string;
  @Input() stop_date: string
  @Input() stopyear: string;
  @Input() startmonth: string;
  @Input() stopmonth: string;
  @Input() per: string;
  @Input() North: number;
  @Input() South: number;
  @Input() West: number;
  @Input() East: number;

  hoveredDate: NgbDate | null = null;
  map: any;
  datalayer: any;
  public index;
  public input_ds;
  public lenght_y;
  public verb;
  public years;
  type;
  percent;
  selectyear;
  range_y;
  value_db;
  Max;
  Min;
  color;
  grid;
  lat_step;
  lon_step;
  public recieveData:DataRecieve;


  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private tempService: TempService,
    private recieveDataService: RecieveDataService) {
  }

  chooseyear1 = new FormGroup({
    fromyear1: new FormControl(),
    toyear1: new FormControl('', Validators.required)
  });
  chooseyear2 = new FormGroup({
    fromyear2: new FormControl('', Validators.required),
    toyear2: new FormControl('', Validators.required)
  });

  public lists: Array<string>
  async ngOnInit() {
    console.log("yearinput", this.start_date)
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
    this.index = this.file
    
    if (this.per != 'yes') {
      this.plot(this.data,this.index)
    }
  }
// databaseeeeeee
  async test_ser(dataset, index) {
    this.recieveDataService.data.asObservable().subscribe(d => {
      console.log("aaaaa",d)
    })
    console.log("test_ser")
    // console.log("Hellokitty",ttt);
    console.time("time")
    this.map = MapLib.draw_map('map')
    // MapLib.add_graticule_layer(this.map)

    await this.tempService.get_detail(dataset, index).then(data => data.subscribe(res => {
      this.color = JSON.parse(res)
      this.color = this.color[0]['color_map']
      console.log(this.color)
    }))

    await this.tempService.get_data_flask(dataset, index, this.startyear, this.startmonth, this.stopyear, this.stopmonth)
      .then(data => data.subscribe(
        res => {
          let resp = JSON.parse(res)
          // console.log("flask",resp)
          this.value_db = resp[0]
          this.Max = Math.max.apply(null, this.value_db);
          this.Min = Math.min.apply(null, this.value_db);
          console.log("Max", this.Max, "Min", this.Min)

          this.tempService.get_grid_db(dataset)
            // .then(data => {console.log("grid",data)})
            .then(data => data.subscribe(
              res => {
                console.log("grid1", res)
                const geojson = MapLib.merge_data_to_geojson(res, this.value_db, this.North, this.South, this.West, this.East);
                var lon_step = res[0]['lon_step']
                var lat_step = res[0]['lat_step']
                this.datalayer = MapLib.genGridData(geojson, this.Min, this.Max, this.color, lon_step, lat_step,'main');
                MapLib.clearLayers(this.map);
                this.map.addLayer(this.datalayer)
                MapLib.select_country(this.map)
              })
            )
        })
      )
    console.timeEnd("time")
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
          this.datalayer = MapLib.genGridData(geojson, resp[3], resp[4], resp[7], resp[5], resp[6],'main');
          // this.selectgrid = MapLib.gridselect(geojson)
          MapLib.clearLayers(this.map);
          this.map.addLayer(this.datalayer)
          MapLib.select_country(this.map)
          // MapLib.select_c(this.map)
          console.log("finish")
          console.timeEnd()

        }
        )))
  }
// ----------USE!!!!!!------------------------------------------------
  async different(){
    this.type = 'per'
    this.map = MapLib.draw_map('map')
    // MapLib.add_graticule_layer(this.map)
    console.log("dat", this.index)
    console.log(this.chooseyear1.controls['fromyear1'].value)
    this.percent = "Work"
    console.time()
    var start1 = this.chooseyear1.controls['fromyear1'].value
    var stop1 = this.chooseyear1.controls['toyear1'].value
    var start2 = this.chooseyear2.controls['fromyear2'].value
    var stop2 = this.chooseyear2.controls['toyear2'].value
    let v
    let L = []
    console.log("-----",this.index)
    await this.tempService.nc_per(this.data, this.index,start1, stop1,start2, stop2).then(data => data.subscribe(
        (res => { 
          // console.log(">>>>>>>>>>",res)
          let resp = JSON.parse(res)
          console.log(">>>>>>>>>",resp)
          // console.log(">>>>>>>>>",resp[3])
          var val = resp[2]

          const geojson = MapLib.convert_to_geojson(val,resp[0],resp[1]);
          console.log("geojson",geojson)
          this.datalayer = MapLib.genGridData(geojson, resp[3], resp[4], resp[7], resp[5], resp[6],'main');
          // this.selectgrid = MapLib.gridselect(geojson)
          MapLib.clearLayers(this.map);
          this.map.addLayer(this.datalayer)
          MapLib.select_country(this.map)
          // MapLib.select_c(this.map)
          console.log("finish")
          console.timeEnd()

        }
        )))
  }
}