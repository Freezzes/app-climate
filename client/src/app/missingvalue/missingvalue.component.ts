import { Component, OnInit } from '@angular/core';
import {Config, Data, Layout} from 'plotly.js';
import { Chart,ChartData } from 'chart.js';
import * as CanvasJS from 'C:/Users/ice/Downloads/canvasjs-3.0.5/canvasjs.min';

import * as Highcharts from 'highcharts';
import * as highheat from 'highcharts/modules/heatmap';
import { HighchartsChartComponent } from 'highcharts-angular';
import { TempService } from 'src/app/services/temp.service';
import Plotly from 'plotly.js-dist'

highheat(Highcharts);

@Component({
  selector: 'app-missingvalue',
  templateUrl: './missingvalue.component.html',
  styleUrls: ['./missingvalue.component.css'],
  providers:[TempService]
})
export class MissingvalueComponent implements OnInit {
  
  public dataplotcsv = [];
  public TempData;
  public stationyear;
  public startyear;
  public stopyear;
  public startmonth;
  public stopmonth;
  public missingval = [];
  public percent = [];
  public d = [];
  dd = [];
  check = "";

  constructor(private tempService: TempService ) { 
  }

  selectdata(){
   this.missingval.map(u => { 
      let val = []
      const a = {}
      let count = 0
      u.map(v =>{
         console.log("v",v)
         for (let n in v.value){   
            console.log("value",v.value,v.x,v.y)
            
            if (String(v.value[n]) ==String("-") ){
               v.value = null
            }else{
               v.value = v.value
         }

      }    

          val.push(v.x,v.y,v.value)
          a[count] = val
          console.log("val",a)
          count += 1
          val = []
     })
   
     for (let i in a){
        this.percent.push(a[i])
     }
          
         //  console.log("p",typeof(this.percent))
      val = []
   })

   // console.log("dd",this.dd)
   console.log("percent",this.percent)
   this.check = 'check';
  }

  async ngOnInit(){ 
     this.missingval = await this.tempService.getMissed();
   //   console.log("get data",this.missingval)
   }  

  async showcsv(){
    this.startyear = String(1951)
    this.startmonth = String(1)
    this.stationyear = [300201,300202,360201]
    this.stopyear = String(1954)
    this.stopmonth = String(12)
    await this.tempService.getrangecsv(this.stationyear,this.startyear,this.stopyear,this.startmonth,this.stopmonth).then(data => data.subscribe(
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
                 
        }
        }

      })
      

   }
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
         categories: [300201,300202,303201,303301,310201,327202,327301,327501,328201,328202, 328301, 329201, 
          330201,331201, 331301, 331401, 331402, 351201,352201, 353201, 353301, 354201, 356201, 356301,357201, 
          357301, 373201, 373301, 376201, 376202, 376203, 376301, 376401, 378201, 379201,379401, 379402, 380201, 
          381201, 381301, 383201, 386301, 387401, 388401, 400201, 400301, 402301,403201, 405201,405301, 407301, 
          407501, 409301,415301, 419301, 423301, 424301, 425201,425301,426201, 426401, 429201,429601, 430201,430401,
          431201, 431301, 431401,432201, 432301, 432401, 436201, 436401, 440201, 440401, 450201,450401,451301, 
          455201, 455203, 455301, 455302, 455601,459201, 459202, 459203, 459204, 459205, 465201,478201, 478301, 
          480201, 480301, 500201, 500202,500301, 501201, 517201, 517301, 532201, 551203, 551301, 551401, 552201, 
          552202, 552301, 552401,560301, 561201, 564201, 564202, 566201,566202,567201, 568301, 568401, 568501, 568502, 
          570201, 580201, 581301, 583201]
      },
      yAxis : {
         categories: [1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,
          1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,
          2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015],
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
            return '<b>' + '</b> missing <br><b>' +
               this.point.value +'</b> % <br><b>' 
 
         }
      },
      series : [{
         name: 'missing',
         borderWidth: 1,
         borderColor:'#FFFFFF',
         nullColor:'#000000',
         data: this.percent,        
         dataLabels: {
            enabled: false,
            color: '#000000'
         }
      }]
     
    };
   
 }
