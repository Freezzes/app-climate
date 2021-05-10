import { Component, OnInit, OnChanges, Input } from '@angular/core';
import 'ol/ol.css';
import * as MapLib from './lib/map.js';
import { NC_csv, st } from '../interfaces/temp.interface'
import { TempService } from 'src/app/services/temp.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable, range } from 'rxjs';
import { geojson } from 'highcharts';
import { data } from 'jquery';
import { InputService } from 'src/app/services/input.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-netcdf',
  templateUrl: './netcdf.component.html',
  styleUrls: ['./netcdf.component.css'],
  providers: [TempService]
})
export class NetcdfComponent implements OnInit {
  showLoadindIndicator = true;

  data: string;
  index: string;
  startyear: string;
  start_date: string;
  stopyear: string;
  startmonth: string;
  stopmonth: string;
  North: number;
  South: number;
  West: number;
  East: number;

  // hoveredDate: NgbDate | null = null;
  decresing;
  incresing;
  map: any;
  // map1: any;
  // map2: any;
  // datalayer : any;
  // datalayer1: any;
  // datalayer2: any;
  // public index;
  lowres_layer: any;
  hires_layer: any;
  trend_layer: any;

  dataset_name;
  long_name;
  difinition;
  unit;
  year;

  details;
  color_map;
  dataset_type;


  // type;
  // percent;    
  // value_db;
  // Max;
  // Min;
  color;
  grid;
  // lat_step;
  // lon_step;
  datalayer;

  data_low;
  // test;
  // ranges;

  // public input_ds;
  // public lenght_y;
  // public verb;
  // public years;

  selectyear;
  range_y;

  monthsel;
  public monthselect = [];

  data_trend;
  select;

  click;
  plot_trend;


  getDataLayer(data, North, South, West, East, layername, color, unit) {
    console.log("GetDataLayer")
    var lon = data[0]
    var lat = data[1]
    var value = data[2]
    var lon_step = data[5]
    var lat_step = data[6]
    var min_ = data[3]
    var max_ = data[4]
    var color = color
    var unit = unit
    var geojson = MapLib.convert_to_geojson(value, lon, lat)
    var merge = MapLib.merge_data_to_geojson(geojson, value, North, South, West, East, 'value')
    var layer = MapLib.genGridData(
      merge, min_, max_, color, unit, lon_step, lat_step, 'main', layername, 'main'
    );
    return layer
  }

  getTrendLayer(data, North, South, West, East, layername) {
    var lon = data[0]
    var lat = data[1]
    var value = data[2]
    var lon_step = data[5]
    var lat_step = data[6]
    var min_ = data[3]
    var max_ = data[4]
    var color = data[7]
    var geojson = MapLib.convert_to_geojson(value, lon, lat)
    var geojsontrend = MapLib.merge_datatrend_to_geojson(geojson, value, North, South, West, East, 'trend')
    var layer = MapLib.draw_trend(geojsontrend, layername);
    return layer
  }

  constructor(
    // private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private tempService: TempService,
    private fb: FormBuilder,
    private sharedData: InputService,
    private SpinnerService: NgxSpinnerService) {
  }

  public lists: Array<string>

  async ngOnInit() {

    this.map = MapLib.draw_map('map')

    await this.sharedData.regionservice.subscribe(data => {
      console.log("input region", data)
      this.North = data[0]
      this.South = data[1]
      this.West = data[2]
      this.East = data[3]
      this.dataset_type = data[4]
    })

    await this.sharedData.Detailservice.subscribe(data => {
      if (data) {
        console.log("input Detail", data)
        this.unit = data[0].unit
        this.difinition = data[0].description
        this.long_name = data[0].long_name
        this.year = data[0].year
        this.dataset_name = data[1]
      }

    })

    // this.plot(this.data,this.index)
    // this.plot_ser()
    this.plot_gridraw()

  }

  async plot_gridraw() {
    // this.noselect = 'no select'
    await this.sharedData.Detailservice.subscribe(data => {
      this.details = data
      // this.color_map = data.color_map
      console.log("input Detail", data[0])
      if (data) {
        // console.log("input Detail",data)
        this.unit = data[0].unit
        this.difinition = data[0].description
        this.long_name = data[0].long_name
        this.year = data[0].year
        this.dataset_name = data[0].dataset
        this.color_map = data[0].color_map
        this.index = data[2].index
        console.log("difinition", this.difinition)
      }
    })
    console.log("444444444444444444444444444444444", this.dataset_type)
    // await this.sharedData.regionservice.subscribe(data => {
    //   console.log("input region",data)
    //   this.North = data[0]
    //   this.South = data[1]
    //   this.West = data[2]
    //   this.East = data[3]
    // })

    await this.sharedData.inputhomeservice.subscribe(data => {
      if (data) {
        console.log("input2222222222", data)
        this.plot_trend = data.plottrend
        // this.plotTrand(this.plot_trend)
      }
    })


    // console.log("plot_trend",this.plot_trend)

    await this.sharedData.lowresservice.subscribe(data => {
      if (data) {

        console.log("ICEEEEEEEEEEEE", data)
        // this.data_low = data
        this.lowres_layer = this.getDataLayer(data.map, this.North, this.South, this.West, this.East, 'lowres_data', this.color_map, this.unit)
        MapLib.clearLayers(this.map);
        console.log("lowlayer", this.lowres_layer)
        this.map.getLayers().insertAt(0, this.lowres_layer);
        this.sharedData.hiresservice.subscribe(data => {
          if (data) {
            console.log("hires", data)
            this.hires_layer = this.getDataLayer(data, this.North, this.South, this.West, this.East, 'hires_data', this.color_map, this.unit)
            console.log("h_mpi", this.hires_layer)
            this.map.getLayers().insertAt(0, this.hires_layer);
            MapLib.setResolution(this.map)
          }
        })
        // console.log("layer mappppp",this.map.getLayers())
        // MapLib.setzoom_center(this.map,this.North, this.South, this.West, this.East)
        // this.sharedData.sendGraphAvg(data.chart)

        // Get selected country data chart
        if (this.select !== null) {
          this.map.removeInteraction(this.select);
        }
        let that = this
        this.select = MapLib.select_country(this.map);
        this.select.on('select', function (e: any) {
          // Checking if not select country change to global stat
          if (e.selected.length == 0) {
            this.noselect = 'no select'
            console.log("NO SELECT")
            that.sharedData.sendGraphAvg(data.chart)
          }
          else if (e.selected.length == 1) {
            this.noselect = 'select'
            var selectedCountry = e.selected[0].get('name');
            console.log("SELECT", selectedCountry)
            if (that.dataset_type == 'rcp') {
              console.log("RCPPPPPPPPPP")
              that.tempService.getCountry_rcp(data.input.dataset, data.input.index, data.input.startyear, data.input.stopyear, data.input.startmonth, data.input.stopmonth, selectedCountry, data.input.rcp, data.input.type).subscribe(
                (res: any) => {
                  var value = Number(data.input.stopyear) - Number(data.input.startyear)
                  var start = Number(data.input.startyear)
                  for (var i = 0; i <= value; i++) {
                    Data.dataPoints.push(
                      { x: new Date(start, 0), y: res[0][i] },
                    )
                    start += 1
                  }
                  console.log("point", Data.dataPoints)
                  var sent = [Data.dataPoints, res[1], res[2], selectedCountry]
                  that.sharedData.sendGraphAvg(sent)
                })              
            }
            else if (that.dataset_type == 'raw') {
              that.tempService.getCountry(data.input.dataset, data.input.index, data.input.startyear, data.input.stopyear, data.input.startmonth, data.input.stopmonth, selectedCountry).subscribe(
                (res: any) => {
                  var value = Number(data.input.stopyear) - Number(data.input.startyear)
                  var start = Number(data.input.startyear)
                  for (var i = 0; i <= value; i++) {
                    Data.dataPoints.push(
                      { x: new Date(start, 0), y: res[0][i] },
                    )
                    start += 1
                  }
                  console.log("point", Data.dataPoints)
                  var sent = [Data.dataPoints, res[1], res[2], selectedCountry]
                  // this.inputservice.sendGraph(sent)
                  that.sharedData.sendGraphAvg(sent)
                  // console.log("graph country",sent)
                  // that.sharedData.sendcountry(res)
                })
            }
            var Data = {
              // value:[],
              dataPoints: []
            }
          }
        });
        // MapLib.select_country(this.map)
      }
    })

    await this.sharedData.trendservice.subscribe(data => {
          this.data_trend = data
          console.log("TTTTT",this.data_trend)
        })
  }


  // async plot_ser() {
  //   // this.SpinnerService.show();  

  //   this.sharedData.regionservice.subscribe(data => {
  //     console.log("input region", data)
  //     this.North = data[0]
  //     this.South = data[1]
  //     this.West = data[2]
  //     this.East = data[3]
  //   })

  //   await this.sharedData.inputhomeservice.subscribe(data => {
  //     if (data) {
  //       console.log("input2222222222", data)
  //       this.plot_trend = data.plottrend
  //       this.plotTrand(this.plot_trend)
  //     }
  //   })


  //   this.sharedData.lowresservice.subscribe(data => {
  //     if (data) {
  //       console.log("input Lowres", data)
  //       this.data_low = data
  //       this.lowres_layer = this.getDataLayer(this.data_low, this.North, this.South, this.West, this.East, 'lowres_data','main')
  //       MapLib.clearLayers(this.map);
  //       this.map.getLayers().insertAt(0, this.lowres_layer);
  //       // MapLib.setResolution(this.map,this.North, this.South, this.West, this.East)
  //       // MapLib.select_country(this.map)
  //       // MapLib.clearLayers(this.map);
  //     }
  //   })

  //   await this.sharedData.hiresservice.subscribe(data => {
  //     if (data) {
  //       console.log("input Hires", data)
  //       console.log("input Anomaly", data.anomaly)
  //       this.hires_layer = this.getDataLayer(data.map, this.North, this.South, this.West, this.East, 'hires_data','main')
  //       this.map.getLayers().insertAt(0, this.hires_layer);
  //       MapLib.setResolution(this.map)

  //       // this.sharedData.sendGraphAvg(data.chart)
  //       // this.sharedData.sendAnomaly(data.anomaly)

  //       // Get selected country data chart
  //       if (this.select !== null) {
  //         this.map.removeInteraction(this.select);
  //       }
  //       let that = this
  //       this.select = MapLib.select_country(this.map);
  //       this.select.on('select', function (e: any) {
  //         // Checking if not select country change to global stat
  //         if (e.selected.length == 0) {
  //           console.log("NO SELECT")
  //           that.sharedData.sendGraphAvg(data.chart)
  //           that.sharedData.sendAnomaly(data.anomaly)
  //         }
  //         else if (e.selected.length == 1) {
  //           var selectedCountry = e.selected[0].get('name');
  //           console.log("SELECT", selectedCountry)
  //           that.tempService.getCountry(data.input.dataset, data.input.index, data.input.startyear, data.input.stopyear, data.input.startmonth, data.input.stopmonth, selectedCountry).subscribe(
  //             (res: any) => {
  //               console.log("resssssssss", res)
  //               console.log("countryyyyy", selectedCountry)
  //               var value = Number(data.input.stopyear) - Number(data.input.startyear)
  //               var start = Number(data.input.startyear)
  //               for (var i = 0; i <= value; i++) {
  //                 Data.dataPoints.push(
  //                   { x: new Date(start, 0), y: res[0][i] },
  //                 )
  //                 start += 1
  //               }
  //               console.log("point", Data.dataPoints)
  //               var sent = [Data.dataPoints, res[1], res[2], selectedCountry]
  //               // this.inputservice.sendGraph(sent)
  //               that.sharedData.sendGraphAvg(sent)
  //               console.log("graph country", sent)
  //               // that.sharedData.sendcountry(res)
  //             })
  //           var Data = {
  //             // value:[],
  //             dataPoints: []
  //           }

  //           that.tempService.anomalyCountry(data.input.dataset, data.input.index, selectedCountry).subscribe(
  //             (res: any) => {
  //               console.log("anoooooo",res)
  //               console.log("anooooo country >", selectedCountry)
  //               this.anomalydata = res[0].anomaly
  //               this.anomaly_year = res[1].year
  //               this.anomaly_name = res[2].name
  //               var unit = res[3]
  //               var Data = {
  //                 dataPoints: []
  //               }
  //               for (var i = 0; i < this.anomalydata.length; i++) {
  //                 if (this.anomalydata[i] > 0) {
  //                   Data.dataPoints.push(
  //                     { y: this.anomalydata[i], label: this.anomaly_year[i], color: 'red' }
  //                   )
  //                 }
  //                 else if (this.anomalydata[i] < 0) {
  //                   Data.dataPoints.push(
  //                     { y: this.anomalydata[i], label: this.anomaly_year[i], color: 'blue' }
  //                   )
  //                 }
  //               }
  //               var send = [Data.dataPoints, this.anomaly_name, unit,selectedCountry]
  //               console.log("ano home :", send)

  //               that.sharedData.sendAnomaly(send)
  //             })

  //         }
  //       });
  //     }
  //   })

  //   await this.sharedData.trendservice.subscribe(data => {
  //     this.data_trend = data
  //   })
  // }


  Trand() {
    console.log("plot_trend_sent", this.plot_trend)
    this.plot_trend = true
    this.decresing = '+ decresing'
    this.incresing = '- incresing'
    console.log("plot_trend", this.plot_trend)
    if (this.plot_trend == true) {
      this.plotTrand(this.plot_trend)
    }
  }

  plotTrand(trend) {
    if (trend == true) {
      var trend_layer = this.getTrendLayer(this.data_trend, this.North, this.South, this.West, this.East, 'trend')
      console.log("trend layer >>> ", trend_layer)
      this.map.addLayer(trend_layer);
    }
  }

  // -----------read npz USE!!!!!!!!!!--------------------------------
  async plot(dataset, index) {
    // this.plot_per()
    this.map = MapLib.draw_map('map')
    // MapLib.add_graticule_layer(this.map)
    console.log("dat", this.index)
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
          console.log(">>>>>>>>>", resp)
          // console.log(">>>>>>>>>",resp[3])
          var val = resp[2]
          for (v in val) {
            data = val[v]
            L.push(data)
          }
          console.log('res', L)
          console.log('min', resp[3])

          const geojson = MapLib.merge_data_to_geojson(resp[0], resp[1], val, this.North, this.South, this.West, this.East);
          this.datalayer = MapLib.genGridData(geojson, resp[3], resp[4], resp[7], resp[5], resp[6], 'main', 'lowres_data');
          // this.selectgrid = MapLib.gridselect(geojson)
          MapLib.clearLayers(this.map);
          this.map.getLayers().insertAt(0, this.datalayer);
          // this.map.addLayer(this.datalayer)
          MapLib.select_country(this.map)
          // MapLib.select_c(this.map)
          console.log("finish")
          console.timeEnd()
        }
        )))
  }


  // async plot_per2(){
  //   // this.percent = "work"
  //   this.monthselect = [];
  //   const selectValueList = this.myForm.get("city").value;
  //   selectValueList.map( item => {
  //      this.monthselect.push(item.id);
  //   });
  //   console.log("selected month : ",this.monthselect)
  //   if(this.monthselect.length == 0){
  //     console.log("!!!!!!!!!!not select month plot !!!!!!!!!!")
  //     this.map_range2()
  //   }
  //   else{
  //     console.log("!!!!!!!!!! select month !!!!!!!!!!")
  //     this.map_range2month()
  //   }
  // }

  // ----------USE!!!!!!------------------------------------------------



}