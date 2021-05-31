import { Component, OnInit, Input } from '@angular/core';
import { TempService } from '../services/temp.service';
import * as MapLib2 from '../map/lib/map_station';
import * as CanvasJS from '../../assets/canvasjs-3.0.5/canvasjs.min';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { map } from 'rxjs/operators';
import { Chart } from 'chart.js';
import { from, range } from 'rxjs';
import * as $ from 'jquery';
import { InputService } from "src/app/services/input.service";


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

  public value;
  public year;
  public name;
  public dataMean;

  dataset_name;
  long_name;
  difinition;
  unit;

  lineChart: Chart;
  barChart: Chart;
  color: any = [];

  constructor(
    private tempService: TempService,
    private sharedData: InputService
  ) { }

  async ngOnInit() {
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

    this.sharedData.graphAvgservice.subscribe(data => {
      if (data) {
        this.plot_chart(data.data, data.year, data.country, this.unit)
      }
    })
    this.sharedData.anomalyservice.subscribe(data => {
      if (data) {
        var datas = data.data
        this.color = []
        for (var i = 0; i < datas.length; i++) {
          if (datas[i] > 0) {
            this.color.push(
              'rgba(255, 0, 0, 1)'
            )
          }
          else if (datas[i] <= 0) {
            this.color.push(
              'rgba(0, 82, 207, 0.8)'
            )
          }
          else if (String(datas[i]) == String('-')) {
            this.color.push(
              'rgba(0, 82, 207, 0.8)'
            )
          }
        }
        this.chart_anomaly(data.data, data.year, data.country, this.unit,data.scope)
      }
    })
  }

  async plot_chart(data, year, country, unit) {
    if (this.lineChart) this.lineChart.destroy();
    this.lineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: year,
        datasets: [{
          data: data,
          fill: false,
          lineTension: 0.2,
          borderColor: "midnightblue",
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false
        },
        title: {
          text: 'Yearly average of' + " " + country,
          fontSize: 20,
          display: true
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Averange'+" " + "(" + unit + ")"
            },
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }

    })
  }


  async chart_anomaly(data, year, country, unit,max) {
    if (this.barChart) this.barChart.destroy();
    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: year,
        datasets: [{
          data: data,
          backgroundColor: this.color,
          borderWidth: 1
        }]
      },
      options: {
        title: {
          text: 'Yearly average of' + " " + country,
          fontSize: 20,
          display: true
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Anomaly'+" " + "(" + unit + ")"
            },
            ticks: {
              min: -max,
              max: max,
              stepSize: max/4            }
          }],

        }
      }

    })
  }
}
