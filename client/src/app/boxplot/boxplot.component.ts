import { Component, OnInit , OnChanges, Input} from '@angular/core';
import { TempService } from '../services/temp.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import * as Highcharts from 'highcharts';
import * as highheat from 'highcharts/modules/heatmap';
import { HighchartsChartComponent } from 'highcharts-angular';
import HighchartsMore from 'highcharts/highcharts-more';
import { FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {Config, Data, Layout} from 'plotly.js';
import { Chart,ChartData } from 'chart.js';
import * as CanvasJS from 'C:/Users/ice/Downloads//cli/canvasjs-3.0.5/canvasjs.min';
import Plotly from 'plotly.js-dist'
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as MapLib2 from '../map/lib/map_station';
import * as ChartLib from './lib/chart.js'
HighchartsMore(Highcharts);

@Component({
  selector: 'app-boxplot',
  templateUrl: './boxplot.component.html',
  styleUrls: ['./boxplot.component.css'],
  providers:[TempService]
})
export class BoxplotComponent implements OnInit {
  @Input() file: string;
  @Input() startyear : String;
  @Input() startmonth : String;
  @Input() startday : String;
  @Input() stopyear : String;
  @Input() stopmonth : String;
  @Input() stopday : String;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  public test=[];
  public stationyear;
  public start_date;
  public end_date;
  public stationselected;
  public plotbox = [];
  public plotout = [];
  public plotname = [];
  public boxval = [];
  public outval = [];
  public nameval = [];
  public anomalydata = []
  public anomaly = []
  public anomalyyear = []
  public checkbar = ''
  public st;
  public stationan = [];
  checkbox = "";
  checkmiss = "";
  dat:any;
  co:any;
  public colorlist = ['#CCFFFF', '#dec183', '#0661CC', '#614215']
  yearList = [1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,
    1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,
    2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018]


  typename = [{id:'season',name:'รายฤดู'},
    {id:'year',name:'รายปี'},
    {id: 'era',name:'ราย 10 ปี'}]

  myForm:FormGroup;
  public dataplotcsv = [];
  public stationmiss;
  public d = [];
  public dfile = [];
  public selectstation = [];
  public selectstationid = [];
  public colorplot :any;
  public colorline : any;
  constructor(private calendar: NgbCalendar, public formatter:NgbDateParserFormatter, private tempService: TempService, private fb: FormBuilder) {
  }
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  async ngOnInit() {  
    }



    choosetype = new FormGroup({
      type:new FormControl('',Validators.required)
    });

    choosetype2 = new FormGroup({
      month:new FormControl('',Validators.required),
      season:new FormControl('',Validators.required),
      year:new FormControl('',Validators.required)
    });
 

    async getstationcode(){
      this.st = String(MapLib2.station_id)
      let fil = this.file
         if(fil == String('Average Temperature')){
            fil = 'mean'
         }
         if(fil == String('Minimum Temperature')){
            fil = 'min'
         }
         if(fil == String('Maximum Temperature')){
            fil = 'max'
         }
         if(fil == String('Preciptipation')){
            fil = 'pre'
         }
      let typeshow = this.choosetype.value
      let ts = ''
      for (let v of Object.values(typeshow)){
        if(String(v) == String('รายเดือน')){
           ts = 'month'
        }
        else if(String(v) == String('รายฤดู')){
          ts = 'season'
       }else if(String(v) == String('รายปี')){
         ts = 'year'
       }else if(String(v) == String('ราย 10 ปี')){
        ts = 'era'
      }
      }
      this.dat = this.testdata1(this.st,fil,ts)
      return this.dat
    }

  
    async testdata1(st,fil,ts){
      this.checkbox = ''
      if(this.startday.length == 1){
        this.startday = '0'+this.startday
      }
      if(this.startmonth.length == 1){
        this.startmonth = '0'+this.startmonth
      }
      this.start_date = String(this.startyear+'-'+this.startmonth+'-'+this.startday)
      if(this.stopday.length == 1){
        this.stopday = '0'+this.stopday
      }
      if(this.stopmonth.length == 1){
        this.stopmonth = '0'+this.stopmonth
      }
      this.end_date = String(this.stopyear+'-'+this.stopmonth+'-'+this.stopday)
      this.stationyear = st
      this.plotbox = []
      this.plotname = []
      this.plotout = []
      this.boxval.length = 0;
      this.nameval.length = 0;
      this.outval.length = 0;
      await this.tempService.getboxvalue(fil,ts,this.stationyear,this.start_date,this.end_date).then(data => data.subscribe(
        res => { 
          console.log("boxplot value : ",res[0])
          this.plotbox.push(res[0])
          this.plotname.push(res[1])
          this.plotout.push(res[2])
        this.plotbox.map(u=>{
          u.map(v=>{
          for (let i in v){
              if(String(v[i]) == String('-')){
                v[i] = null
              }
            // console.log("i in v[i] : ",v[i])
          }
          this.boxval.push(v)
          this.checkbox = 'check';          
          })
        })
        this.plotname.map(v=>{
          for(let i of v){
            this.nameval.push(i)
          }
          this.checkbox = 'check';
         })
  
         this.plotout.map(u=>{
           u.map(v=>{
           for (let i in v){
            for (let j in v[i]){
              for (let k in v[i][j]){
                for(let l in v[i][j][k]){
  
                  if(String(v[i][j][k][l]) == String('-')){
                    v[i][j][k][l] = null
                  }          
                }
              this.outval.push(v[i][j][k])
              }
  
              
            }
         }
         if(fil == 'pr'){
           this.colorplot = this.colorlist[1]
           this.colorline = this.colorlist[3]
         }else{
           this.colorplot = this.colorlist[0]
           this.colorline = this.colorlist[2]
         }
         console.log("color plot >>> ",this.colorplot)
          ChartLib.box_chart(this.boxval,this.nameval,this.outval,ts,this.colorplot, this.colorline)
          this.checkbox = 'check';
        })
      })
      }))
      return this.boxval
    }
  
     // bar plot anomaly data
     public anomaly_year = []
     public anomaly_name = [];
     
     async plotbar(){
        this.checkbar = ''
        this.st = String(MapLib2.station_id)
        let fil = this.file
        if(fil == String('Average Temperature')){
           fil = 'mean'
        }
        if(fil == String('Minimum Temperature')){
           fil = 'min'
        }
        if(fil == String('Maximum Temperature')){
           fil = 'max'
        }
        if(fil == String('Preciptipation')){
           fil = 'pr'
        }
        this.stationan.push(this.st)
        this.anomaly = []
        this.anomaly_year = []
        this.anomaly_name.length = 0;
        this.anomalydata.length = 0;
        this.anomalyyear.length = 0;
        await this.tempService.getanomaly(this.st,fil).then(data => data.subscribe(
        res => { 
          this.anomaly.push(res[0])
          this.anomaly_year.push(res[1])
          this.anomaly_name.push(res[2])
          this.anomaly.map(u=>{
            
            for (let v in u){
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
          this.anomaly_year.map(u=>{
            for (let v in u){
              for (let i in u[v]){
              this.anomalyyear.push(u[v][i])               
              }
            }
          })
          this.checkbar = 'check'
        }))

     }

   highchartsbar = Highcharts;
   chartOptionsbar = {   
      chart: {
         type: 'column'
      },
      title: {
         text: 'Anomaly'
      },
      xAxis:{
         categories: this.anomalyyear
      },     
      series: [
         {
            name: this.anomaly_name,
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
