import { Component, OnInit } from '@angular/core';
import * as Plotly from 'plotly.js';
import {Config, Data, Layout} from 'plotly.js';
import { Chart,ChartData } from 'chart.js';
import * as CanvasJS from 'C:/Users/Mewkkn/Downloads/canvasjs-3.0/canvasjs.min';

import 'ol/ol.css';
import * as Highcharts from 'highcharts';
import * as highheat from 'highcharts/modules/heatmap';
import { HighchartsChartComponent } from 'highcharts-angular';
import { TempService } from 'src/app/services/temp.service';
// highheat(Highcharts);



@Component({
  selector: 'app-boxplot',
  templateUrl: './boxplot.component.html',
  styleUrls: ['./boxplot.component.css'],
  providers:[TempService]
})

export class BoxplotComponent implements OnInit {
  public dataplotcsv = [];
  public TempData;
  public stationyear;
  public startyear;
  public stopyear;
  public startmonth;
  public stopmonth;
  constructor(private tempService: TempService ) { 
  }

  async ngOnInit(){
    
}
  async showcsv(){
    this.startyear = String(1951)
    this.startmonth = String(1)
    // this.stationyear = [300201,300202,360201]
    this.stopyear = String(1954)
    this.stopmonth = String(12)
    await this.tempService.getrangecsv(this.startyear,this.stopyear,this.startmonth,this.stopmonth).then(data => data.subscribe(
      res => { 
      this.dataplotcsv = [];
        this.dataplotcsv.push(res)
      }
    ))
    let s = this.dataplotcsv
    let select
    let stationcode:any
    let plotdata = [];
    let year = [];


    // GET STATION CODE
    this.dataplotcsv.map(v =>{
        let a = Object.values(v)
        console.log(a)
        if (String(a) == 'year' ){
            // console.log("vki",a)
        }
        else{
          // console.log("not year", String(a))
          for (var k of a){
            console.log("ak",)
          
            // for ( var i in v[k]){
            //   plotdata.push(v[k][i])
              
            // }         
        }
        }

      })
   }
      // console.log("plot",plotdata)
    // this.dataMeanDB.map(v => {
    //   let a = Object.keys(v)
    //   for (var k of a){

    //     if (String(stationcode) == k ){
    //       for (var i in v[k]){
    //         plotdata.push(v[k][i])
    //       }
    //     }
    //   }
    // })
  
  highcharts = Highcharts;
  chartOptions = {   
     chart : {
        type: 'heatmap',
        marginTop: 40,
        marginBottom: 80,

     },
     title : {
        text: 'Missing Value'   
     },
     xAxis : {
        categories: ['300201','300202','303201']
     },
     yAxis : {
        categories: ['1951', '1852', '1953', '1954', '1955','1956','1957','1958','1959'],
           title: null
     },
     colorAxis : {
        min: 0,
        max:100,
        minColor: '#0661CC',
        maxColor: '#FFFFFF'
     },
     legend : {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        // color: '#ffffff',
        y: 25,
        symbolHeight: 280
     },
     tooltip : {
        formatter: function () {
           return '<b>' + this.series.xAxis.categories[this.point.x] +
              '</b> sold <br><b>' +
              this.point.value +
              '</b> items on <br><b>' +
              this.series.yAxis.categories[this.point.y] + '</b>';
        }
     },
     series : [{
        name: 'Sales per employee',
        borderWidth: 1,
        borderColor:'#FFFFFF',
        nullColor:'#000000',
        NaNColor:'#8D8D8D',
        data: [[0, 0,0], [0, 1, 19], [0,2,null], [0, 3, null], [0, 4, 67],
        [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 100], [1, 4, 48],
        [2, 0, null], [2, 1, 5], [2, 2, 8], [2, 3, 71], [2, 4, 100]],
        
        dataLabels: {
           enabled: true,
           color: '#000000'
        }
     }]
    
   };
  
}