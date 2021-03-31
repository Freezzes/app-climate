import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { TempService } from '../services/temp.service';
import * as MapLib2 from '../map/lib/map_station';
import * as CanvasJS from 'C:/Users/ice/Downloads/cli/canvasjs-3.0.5/canvasjs.min';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { map } from 'rxjs/operators';
import { Chart } from 'chart.js';
import { from, range } from 'rxjs';
import * as $ from 'jquery';
import { InputService } from "src/app/services/input.service";
import * as ChartLib from './hightchart.js';


@Component({
  selector: 'app-netcdfgraph',
  templateUrl: './netcdfgraph.component.html',
  styleUrls: ['./netcdfgraph.component.css'],
  providers: [TempService]
})
export class NetcdfgraphComponent implements OnInit {

  @Input() data: string;
  @Input() file: string;
  @Input() startyear: string;
  @Input() start_date: string;
  @Input() stop_date: string
  @Input() stopyear: string;
  @Input() startmonth: string;
  @Input() stopmonth: string;

  public checkbar = '';
  public titlename = [];
  public anomalydata = []
  public anomaly = []
  public anomalyyear = []
  public fileanomaly = []
  public nameanomaly: any;
  public testa: any;
  public get;
  public Data;
  public value_avg;
  public dataTemp;
  public dataMean;
  public dataMeanDB;
  public name = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(
    private tempService: TempService,
    private sharedData: InputService
  ) { }

  async ngOnInit() {
    console.log("graphhhhhhhhhhhhhhhhhhh")
    this.get_data()
    this.sharedData.graphAvgservice.subscribe(data => {
      if (data) {
        console.log("graph", data)
        // var avg = data[1]
        // console.log("datapoint",data[0])
        this.plotMean(data[0], data[1], data[2])
        // this.Data.dataPoints = data[0]
        // console.log("test graph",this.Data.dataPoints)
      }
    })

    // this.sharedData.anomalyservice.subscribe(ano => {
    //   if (ano) {
    //     console.log("data recirve >>>>> ", ano)
    //     console.log("plot ano name .... ", ano[2])
    //     // this.plotanomaly(ano)
    //     // this.anomalydata = ano[0]
    //     // this.anomaly_year = ano[1]
    //     // this.fileanomaly = ano[2]
    //     this.get_data(ano[0],ano[1],ano[2])
    //     // this.draw_seasonal_chart('anomaly',this.anomalydata, this.anomaly_year,this.nameanomaly)
    //   }
    // })
    // console.log("ano name ...",this.fileanomaly)
    // this.plotbar()
    // this.draw_seasonal_chart('anomaly')
    // this.plotanomaly(this.testa)
    let highchartsbar = Highcharts;
    let chartOptionsbar = {
      chart: {
        type: 'column'
      },
      title: {
        text: '',
        style: {
          display: 'none'
        }
      },
      xAxis: {
        categories: this.anomaly_year
      },
      series: [
        {
          name: this.fileanomaly,
          data: this.anomalydata,
          zones: [{
            value: -0,
            color: '#306EFF'
          }, {
            color: '#E42217'
          }]
        }
      ]
    };

  }

  async get_data(){
    this.sharedData.anomalyservice.subscribe(ano => {
      if (ano) {
        console.log("data recirve >>>>> ", ano)
        console.log("plot ano name .... ", ano[2])
        // this.plotanomaly(ano)
        this.anomalydata = ano[0]
        this.anomaly_year = ano[1]
        this.fileanomaly = ano[2]
        ChartLib.draw_seasonal_chart('amomaly',this.anomalydata, this.anomaly_year,this.nameanomaly)
       
        // this.get_data(ano[0],ano[1],ano[2])
        // this.draw_seasonal_chart('anomaly',this.anomalydata, this.anomaly_year,this.nameanomaly)
      }
    })
    // this.anomalydata = anomalydata
    // this.anomaly_year = anomaly_year
    // this.fileanomaly = fileanomaly
    // console.log("ano name ...",this.fileanomaly)
  }

  async plotMean(Data, Avg, unit) {
    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      title: {
        text: null
      },
      axisY: {
        title: "Averange temperature",
        // valueFormatString: "#,,.",
        suffix: unit,
        stripLines: [{
          value: Avg,
          label: "Average"
        }]
      },
      data: [{
        yValueFormatString: "#.### " + unit,
        xValueFormatString: "YYYY",
        showInLegend: true,
        type: "line",
        dataPoints: Data
      }]
    });
    chart.render();
  }

  // bar plot anomaly data
  public anomaly_year = []
  public anomaly_name = [];

  async plotbar() {
    this.checkbar = ''
    let fil = this.file
    console.log("anomaly plot >>> ", this.data, this.file)
    this.anomaly = []
    this.anomaly_year = []
    this.anomaly_name.length = 0;
    this.anomalydata.length = 0;
    this.anomalyyear.length = 0;
    await this.tempService.getanomalync(this.data, this.file).then(data => data.subscribe(
      res => {
        this.anomaly.push(res[0])
        this.anomaly_year.push(res[1])
        this.anomaly_name.push(res[2])
        // console.log("res : ",this.anomaly,this.anomaly_year)
        this.anomaly.map(u => {

          for (let v in u) {
            // this.anomaly_name.push(v)
            // console.log(v,"v")
            for (let i in u[v]) {
              if (String(u[v][i]) == String("-")) {
                u[v][i] = null
              } else {
                u[v][i] = Number(u[v][i])
              }
              this.anomalydata.push(u[v][i])
            }
          }
        })
        this.anomaly_name.map(u => {
          // console.log( "u name : ", u)
          for (let v in u) {
            this.fileanomaly.push(u[v])
          }
        })
        this.anomaly_year.map(u => {
          for (let v in u) {
            for (let i in u[v]) {
              this.anomalyyear.push(u[v][i])
            }
          }
        })
        console.log("anomaly_name : ", this.fileanomaly)
        this.fileanomaly = this.nameanomaly
        console.log("ano name in plotbar...", this.nameanomaly)
        console.log("file name anoma ...", this.fileanomaly)
        this.checkbar = 'check'
      }))

  }

  public a_name = [];
  a_data;
  a_year;
  //  async plotanomaly(ano){
  //    this.a_data = ano[0]
  //     this.a_year = ano[1]
  //     this.a_name = ano[2]
  //     console.log("ddddd ",this.a_data)
  //     console.log("nnnnnnnn",this.a_name)
  //     console.log("plot a ....",this.a_year)

  //     this.checkbar = 'check'

  //  }

  // async draw_seasonal_chart(target,anomalydata,anomaly_year, fileanomaly) {
  //   console.log("draw_seasonal_chart")
  //   var chart = new Highcharts.chart(target, {
  //       chart: {
  //           type: 'column',
  //       },
  //       title: {
  //         text: '',
  //         style: {
  //             display: 'none'
  //         }
  //       },
  //       xAxis: {
  //           categories: anomaly_year
  //       },
  //       series: [
  //         {
  //            name: fileanomaly,
  //            data: anomalydata,
  //            zones: [{
  //                value: -0,
  //                color: '#306EFF'
  //            }, {
  //                color: '#E42217'
  //            }]
  //         }
  //      ]
  //   })
  //   chart.render();
  //   // return chart
  // }

  highchartsbar = Highcharts;
  chartOptionsbar = {
    chart: {
      type: 'column'
    },
    title: {
      text: '',
      style: {
        display: 'none'
      }
    },
    xAxis: {
      categories: this.anomaly_year
    },
    series: [
      {
        name: this.fileanomaly,
        data: this.anomalydata,
        zones: [{
          value: -0,
          color: '#306EFF'
        }, {
          color: '#E42217'
        }]
      }
    ]
  };


}
