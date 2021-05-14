import { Component, OnInit, Input } from '@angular/core';
import 'ol/ol.css';
import * as MapLib from './lib/map.js';
import { DataService } from 'src/app/services/data.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { InputService } from "src/app/services/input.service";

@Component({
  selector: 'app-netcdf',
  templateUrl: './netcdf.component.html',
  styleUrls: ['./netcdf.component.css'],
  providers: [DataService]
})
export class NetcdfComponent implements OnInit {
  plot_trend: boolean;
  data: string;
  dataset: string;
  // index: string;
  startyear: string;
  start_date: string;
  stopyear: string;
  startmonth: string;
  stopmonth: string;
  North: number;
  South: number;
  West: number;
  East: number;

  map: any;
  lowres_layer: any;
  hires_layer: any;

  long_name: string;
  difinition: string;
  unit: any;
  year: any;
  index: string;

  color: string;
  datalayer;

  data_low;
  public dataset_name: any;
  select: any = null;
  details: any;
  trend_layer;
  selectcountry: any;
  chart;
  test_click;
  noselect;
  color_map;
  dataset_type;
  getDataLayer(data, North, South, West, East, layername, color, unit, long_name) {
    console.log("GetDataLayer")
    var lon = data[0]
    var lat = data[1]
    var value = data[2]
    var lon_step = data[5]
    var lat_step = data[6]
    var min_ = data[3]
    var max_ = data[4]
    var long_name = long_name
    var color = color
    var unit = unit
    var geojson = MapLib.convert_to_geojson(value, lon, lat)
    var merge = MapLib.merge_data_to_geojson(geojson, value, North, South, West, East, 'value')
    var layer = MapLib.genGridData(
      merge, min_, max_, color, unit, lon_step, lat_step, 'main', layername, 'main',long_name
    );
    return layer
  }

  constructor(
    public formatter: NgbDateParserFormatter,
    private dataService: DataService,
    private sharedData: InputService
  ) { }

  public lists: Array<string>
  async ngOnInit() {
    console.log("Oninit")
    this.map = MapLib.draw_map('map')
    await this.sharedData.regionservice.subscribe(data => {
      console.log("input region", data)
      this.North = data[0]
      this.South = data[1]
      this.West = data[2]
      this.East = data[3]
      this.dataset_type = data[4]
    })
    this.plot_gridraw()
  }

  async plot_gridraw() {
    // this.noselect = 'no select'
    await this.sharedData.Detailservice.subscribe(data => {
      this.details = data
      // this.color_map = data.color_map
      console.log("input Detail", data)
      if (data) {
        // console.log("input Detail",data)
        this.unit = data[0].unit
        this.difinition = data[0].description
        this.long_name = data[0].long_name
        this.year = data[0].year
        this.dataset_name = data[0]
        this.color_map = data[0].color_map
        this.index = data[2]
        console.log("dataset", this.dataset_name)
      }
    })
   

    await this.sharedData.inputhomeservice.subscribe(data => {
      if (data) {
        // console.log("input2222222222",data)
        this.plot_trend = data.plottrend
        this.test_trend(this.plot_trend)
      }
    })

    // console.log("plot_trend",this.plot_trend)

    await this.sharedData.lowresservice.subscribe(data => {
      if (data) {
        // this.data_low = data
        this.lowres_layer = this.getDataLayer(data.map, this.North, this.South, this.West, this.East, 'lowres_data', this.color_map, this.unit, this.long_name)
        MapLib.clearLayers(this.map);
        console.log("lowlayer", this.lowres_layer)
        this.map.getLayers().insertAt(0, this.lowres_layer);
        this.sharedData.hiresservice.subscribe(data => {
          if (data) {
            console.log("hires", data)
            this.hires_layer = this.getDataLayer(data, this.North, this.South, this.West, this.East, 'hires_data', this.color_map, this.unit, this.long_name)
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
            if( that.dataset_type == 'rcp'){
              console.log("RCPPPPPPPPPP")
              that.dataService.getCountry_rcp(data.input.dataset, data.input.index, data.input.startyear, data.input.stopyear, data.input.startmonth, data.input.stopmonth, selectedCountry, data.input.rcp, data.input.type).subscribe(
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
            else if( that.dataset_type == 'raw'){
            that.dataService.getCountry(data.input.dataset, data.input.index, data.input.startyear, data.input.stopyear, data.input.startmonth, data.input.stopmonth, selectedCountry).subscribe(
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
  }

  test() {
    console.log("plot_trend_sent", this.plot_trend)
    this.plot_trend = !this.plot_trend
    console.log("plot_trend", this.plot_trend)
    this.test_trend(this.plot_trend)

  }


  async test_trend(trend) {
    if (trend == true) {
      console.log("AAAAAAA")
      this.test_click = 'plot_trend'
      console.log("test plot trend", this.West, this.East)
      // await this.sharedData.regionservice.subscribe(data => {
      //   console.log("input region 444",data)
      // })
    } else {
      console.log("BBBBBB")
      this.test_click = ''
    }

    // this.plot_trend = false
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

    await this.dataService.get_detail(dataset, index).then(data => data.subscribe(res => {
      this.color = JSON.parse(res)
      this.color = this.color[0]['color_map']
      console.log(this.color)
    }))

    await this.dataService.get_lowres(dataset, index, this.startyear, this.stopyear,
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
          this.datalayer = MapLib.genGridData(geojson, resp[3], resp[4], resp[7], resp[5], resp[6], 'main', 'lowres_data', 'main');
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

}