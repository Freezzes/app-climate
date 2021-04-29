import { Component, OnInit , OnChanges, Input} from '@angular/core';
import {Config, Data, Layout} from 'plotly.js';
import { Chart,ChartData } from 'chart.js';
import * as CanvasJS from 'C:/Users/ice/Downloads//cli/canvasjs-3.0.5/canvasjs.min';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as ChartLib from './lib/chart.js';
import * as Highcharts from 'highcharts';
import * as highheat from 'highcharts/modules/heatmap';
import { HighchartsChartComponent } from 'highcharts-angular';
import { TempService } from 'src/app/services/temp.service';
import Plotly from 'plotly.js-dist'
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormControl, Validators} from '@angular/forms';
import { InputService } from 'src/app/services/input.service';

// highheat(Highcharts);

@Component({
  selector: 'app-missingvalue',
  templateUrl: './missingvalue.component.html',
  styleUrls: ['./missingvalue.component.css'],
  providers:[TempService]
})
export class MissingvalueComponent implements OnInit {
   @Input() file: string;

   missed_chart: any;

  yearList = [1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,
   1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,
   2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018]
   filename = [{id:'tas',name:'Temperature mean'},
               {id:'tasmin',name:'Temperature min'},
               {id:'tasmax',name:'Temperature max'},
               {id:'pre',name:'Preciptipation'}]

   public dataplotcsv = [];
   public TempData;
   public stationyear;
   public startyear;
   public stopyear;
   public startmonth;
   public stopmonth;
   public station;
   public missdata = [];
   public missingval = [];
   public percent = [];
   public percentplot = [];
   public d = [];
   public dfile = [];
   check = "";
   public selectstation = [];
   public selectstationid = [];
   updateFlag = false;
   // chartOptions:any;
  constructor(private tempService: TempService, private fb: FormBuilder, private sharedData: InputService ) { 
  }



  async ngOnInit(){ 
     console.log("Init chart")
   await this.sharedData.missedvalueservice.subscribe(data => {
      if(data){
         console.log("missing station :",data) //อันนี้ดึงมาทั้งก้อน
         // this.missed_chart = ChartLib.missing_chart(data)
         console.log("miss chart >>>", this.missed_chart)
         //this.annual_chart = ChartLib.draw_global_chart('container1', this.Data(res.global_avg), res.year, res.yAxis)
      this.missed_chart = ChartLib.missing_chart(data)
      console.log("miss chart >>>", this.missed_chart)
      }})
     
    }  


//   async selectmiss(){
//    this.check = ''

//    let fil = this.file
//    if(fil == String('Average Temperature')){
//       fil = 'mean'
//    }
//    if(fil == String('Minimum Temperature')){
//       fil = 'min'
//    }
//    if(fil == String('Maximum Temperature')){
//       fil = 'max'
//    }
//    if(fil == String('Preciptipation')){
//       fil = 'pre'
//    }

//    console.log("start year : ", this.startyear)
//    let per=[];
//    this.percentplot.length = 0
//    await this.tempService.getmissing(fil).then(data => data.subscribe(
//      res => { 
//      this.missdata = [];
//        this.missdata.push(res)
//        console.log("missdata miss: ",this.missdata)
//      this.missdata.map(u => { 
//       //   console.log("select u",u)
//         let val = []
//         const a = {}
//         let count = 0
//         u.map(v =>{
//            for (let n in v.value){   
//               if (String(v.value[n]) == String("-") ){
//                  v.value = null
//               }else{
//                  v.value = v.value
//            }
//         }
//            val.push(v.x,v.y,v.value)
//             a[count] = val
//             count += 1
//             val = []
//             // console.log("miss val",a)
//         })

//         for (let i in a){
//           this.percentplot.push(a[i])
//        }
//        console.log("miss per : ",this.percentplot)
//        console.log("p",typeof(this.percentplot))
//         val = []
//       ChartLib.chartoption(this.percentplot)
//       // this.chartOptions = this.percentplot
//      })
//     this.check = 'check';
//   }))
 
//   }


   // highcharts = Highcharts;
   // // chartOptions = this.chartOptions
   // chartOptions = {   
   //    chart : {
   //       type: 'heatmap',
   //       marginTop: 40,
   //       marginBottom: 80,
 
   //    },
   //    title: {
   //       text: '',
   //       style: {
   //           display: 'none'
   //       }
   //   },
   //    xAxis : {
   //       categories: [300201,300202,303201,303301,310201,327202,327301,327501,328201,328202, 328301, 329201, 
   //        330201,331201, 331301, 331401, 331402, 351201,352201, 353201, 353301, 354201, 356201, 356301,357201, 
   //        357301, 373201, 373301, 376201, 376202, 376203, 376301, 376401, 378201, 379201,379401, 379402, 380201, 
   //        381201, 381301, 383201, 386301, 387401, 388401, 400201, 400301, 402301,403201, 405201,405301, 407301, 
   //        407501, 409301,415301, 419301, 423301, 424301, 425201,425301,426201, 426401, 429201,429601, 430201,430401,
   //        431201, 431301, 431401,432201, 432301, 432401, 436201, 436401, 440201, 440401, 450201,450401,451301, 
   //        455201, 455203, 455301, 455302, 455601,459201, 459202, 459203, 459204, 459205, 465201,478201, 478301, 
   //        480201, 480301, 500201, 500202,500301, 501201, 517201, 517301, 532201, 551203, 551301, 551401, 552201, 
   //        552202, 552301, 552401,560301, 561201, 564201, 564202, 566201,566202,567201, 568301, 568401, 568501, 568502, 
   //        570201, 580201, 581301, 583201],
   //        labels: {
   //          rotation: -90,
   //         step:1,
   //          style: {
   //              fontSize:'7px'
   //           }
   //       }
   //    },
   //    yAxis : {
   //       categories: [1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,
   //        1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,
   //        2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015],
   //          title: null
   //    },
   //    colorAxis : {
   //       min: 0,
   //       max:100,
   //       minColor: '#0661CC',
   //       maxColor: '#FFFFFF'
   //    },
   //    legend : {
   //       align: 'right',
   //       layout: 'vertical',
   //       margin: 0,
   //       verticalAlign: 'top',
   //       // color: '#ffffff',
   //       y: 25,
   //       symbolHeight: 280
   //    },
   //    tooltip : {
   //       formatter: function () {
   //          return '<b>' + '</b> missing <br><b>' +
   //             this.point.value +'</b> % <br><b>' 
 
   //       }
   //    },
   //    series : [{
   //       name: 'missing',
   //       borderWidth: 1,
   //       turboThreshold:0,
   //       borderColor:'#FFFFFF',
   //       nullColor:'#000000',
   //       data: this.percentplot,       
   //       dataLabels: {
   //          enabled: false,
   //          color: '#000000'
   //       }
   //    }]
     
   //  };
   
 }
