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
    const start = new Date();
    this.sharedData.graphAvgservice.subscribe(data => {
      if (data) {
        console.log("graph", data)
        this.plotMean(data[0], data[1], data[2],this.long_name,data[3])
      }
    })
    let elapsed = new Date();
    console.log("sent data time : ",start,">>",elapsed)
     this.sharedData.anomalyservice.subscribe(data => {
      if(data){
        console.log("anomaly service",data)
        this.value = data[0]
        this.name = data[1]
        var unit = data[2]
        var country = data[3]
        console.log("countryyy",data[3])
        this.plot_anomaly(this.value,this.name,unit,country)
      }
    })
  }

  
  async plot_anomaly(value,name,unit,country){
    console.log("unittttttt",unit)
    var chart = new CanvasJS.Chart("anomaly", {
      animationEnabled: true,
      
      title:{
        text:name +' of '+country,
        fontSize: 25,
        fontFamily: "Open Sans",
      },
      axisX:{
        title : 'Year',
        fontSize: 12,
        // labelAngle: -90,
        // interval: 1
      },
      axisX2:{
        gridColor: "rgba(1,77,101,.1)",
      },
      axisY:{
        title : name,
        suffix: unit,
        fontSize: 12
       },
      data: [{
        yValueFormatString: "#.# " + unit,
        // showInLegend: true,
        type: "column",
        // name: "companies",
        dataPoints: value
      }]
    });
    chart.render();
  }

  async plotMean(Data, Avg, unit,name,country) {
    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      title: {
        text: "Averange " + name +' of '+country,
        fontSize: 25,
        fontFamily: "Open Sans", 
      },
      axisY: {
        title: name,
        // valueFormatString: "#,,.",
        suffix: unit,
        fontSize: 12,
        stripLines: [{
          value: Avg,
          label: "Average"
        }]
      },
      data: [{
        yValueFormatString: "#.### " + unit,
        xValueFormatString: "YYYY",
        // showInLegend: true,
        type: "line",
        dataPoints: Data
      }]
    });
    chart.render();
  }
}
