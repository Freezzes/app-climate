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

@Component({
  selector: 'app-netcdfgraph',
  templateUrl: './netcdfgraph.component.html',
  styleUrls: ['./netcdfgraph.component.css'],
  providers:[TempService]
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
  public titlename = [] ;
  public anomalydata = []
  public anomaly = []
  public anomalyyear = []
  public fileanomaly = [];

  public get;
  public Data;
  public value_avg;
  public dataTemp;
  public dataMean;
  public dataMeanDB;
  public name = ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec'];

  constructor(
    private tempService: TempService
    ) { }

  async ngOnInit() {
    await this.tempService.global_avg(this.data, this.file, this.startyear, this.startmonth, this.stopyear, this.stopmonth)
    .then(data => data.subscribe(res => {
      console.log("global",res)
      var data = Number(this.stopyear)- Number(this.startyear)
      console.log("dddddd",data)
      var start = Number(this.startyear)
      for (var i =0; i<= data; i++){
        this.Data.dataPoints.push(
          {x: new Date(start, 0), y: res[0][i]},
       
        )
        start+=1
      }
      console.log("point",this.Data.dataPoints)
      this.plotMean(res[1],res[2])
    }))

    this.Data = {
      value:[],
      dataPoints : []
    }
    this.plotbar()
  }
  async plotMean(Avg,unit) {
    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,  
      title:{
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
        yValueFormatString: "#.### "+ unit,
        xValueFormatString: "YYYY",
        showInLegend: true,
        type: "line",
        dataPoints: this.Data.dataPoints
      }]
    });
    chart.render();
  }

  async datapoint(){
    await this.tempService.global_avg(this.data, this.file, this.startyear, this.startmonth, this.stopyear, this.stopmonth)
    .then(data => data.subscribe(res => {
      console.log("global",res)
      var data = Number(this.stopyear)- Number(this.startyear)
      console.log("dddddd",data)
      for (var i =0; i< data; i++){
        this.Data.dataPoints.push(
          {x: new Date(data[i], 0), y: res[0][i]},
        )
      }
    }))

    this.Data = {
      value:[],
      dataPoints : []
    }
  }

       // bar plot anomaly data
       public anomaly_year = []
       public anomaly_name = [];
       
       async plotbar(){
          this.checkbar = ''
          let fil = this.file

          this.anomaly = []
          this.anomaly_year = []
          this.anomaly_name.length = 0;
          this.anomalydata.length = 0;
          this.anomalyyear.length = 0;
          await this.tempService.getanomalync(this.file).then(data => data.subscribe(
          res => { 
            this.anomaly.push(res[0])
            this.anomaly_year.push(res[1])
            this.anomaly_name.push(res[2])
            console.log("res : ",this.anomaly,this.anomaly_year)
            this.anomaly.map(u=>{
              
              for (let v in u){
                // this.anomaly_name.push(v)
                console.log(v,"v")
                for (let i in u[v]){
                  if(String(u[v][i]) == String("-")){
                      u[v][i] = null
                  }else{
                    u[v][i] = Number(u[v][i])
                  }   
                this.anomalydata.push(u[v][i])               
                }
              }
            })
            this.anomaly_name.map(u =>{
              console.log( "u name : ", u)
              for (let v in u ){
                this.fileanomaly.push(u[v])
              }
            })
            this.anomaly_year.map(u=>{
              for (let v in u){
                for (let i in u[v]){
                this.anomalyyear.push(u[v][i])               
                }
              }
            })
            console.log("anomaly_name : ",this.fileanomaly)
            this.checkbar = 'check'
          }))
  
       }

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
     xAxis:{
        categories: this.anomalyyear
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
