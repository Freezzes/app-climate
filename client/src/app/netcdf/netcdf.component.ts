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
  lowres_layer: any;
  hires_layer: any;

  data_lowres: any;
  data_hires: any;
  grid_lowres: any;
  grid_hires: any;

  long_name;
  difinition;
  unit;
  year;

  public index;
  type;
  percent;
  value_db;
  Max;
  Min;
  color;
  lat_step;
  lon_step;

  public recieveData:DataRecieve;

  getDataLayer(data,North,South,West,East,layername) {
    var lon = data[0]
    var lat = data[1]
    var value = data[2]
    var lon_step = data[5]
    var lat_step = data[6]
    var min_ =  data[3]
    var max_ = data[4]
    var color = data[7]
    var geojson = MapLib.merge_data_to_geojson(lon, lat, value, North,South,West,East)
    var layer = MapLib.genGridData(
      geojson, min_, max_, color, lon_step, lat_step,'main', layername
    );
    // if(data.legend.fix){
    //   layer = MapLib.genGridData(
    //     geojson, min_, max_, this.color, lon_step, lat_step,'main', layername
    //   );
    // } else {
    //   layer = MapLib.genGridData(
    //     geojson, this.Min, this.Max, color, lon_step, lat_step,'main', layername);
    // }
    return layer
  }

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

    await this.tempService.detail(this.data,this.index).then(data => data.subscribe(
      res => {
        console.log("detailllllll",res['color_map'])
        this.color = res['color_map']
        this.long_name = res['long name']
        this.difinition = res['description']
        this.unit = res['unit']
        this.year = res['year']
        }))
    
    if (this.per != 'yes') {
      this.map = MapLib.draw_map('map')

      await this.tempService.get_Avgcsv(this.data, this.index, this.startyear, this.stopyear,
        this.startmonth, this.stopmonth).then(data => data.subscribe(
          (res => { 
            // console.log(">>>>>>>>>>",res)
            let resp = JSON.parse(res)
            this.data_lowres = resp
          // get layer for add to map
            this.lowres_layer = this.getDataLayer(resp,this.North, this.South, this.West, this.East,'lowres_data')
            MapLib.clearLayers(this.map);
            this.map.getLayers().insertAt(0,this.lowres_layer);
            MapLib.setResolution(this.map,this.North, this.South, this.West, this.East)
            MapLib.select_country(this.map)
            // this.map.getView().setCenter([115, 5])
          })
        ))
      
      await this.tempService.get_hire(this.data, this.index, this.startyear, this.stopyear,
        this.startmonth, this.stopmonth).then(data => data.subscribe(
          (res => { 
            // console.log(">>>>>>>>>>",res)
            let resp = JSON.parse(res)
            this.hires_layer = this.getDataLayer(resp,this.North, this.South, this.West, this.East,'hires_data')
            // this.map.getLayers().insertAt(0,this.hires_layer);
            // MapLib.setResolution(this.map)

          
          })
        ))
        }

    // if (this.per != 'yes') {
    //   this.plot(this.data,this.index)
    // }
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
          this.map.getLayers().insertAt(0,this.datalayer);
          // this.map.addLayer(this.datalayer)
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