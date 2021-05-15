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
import Plotly from 'plotly.js-dist'
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as MapLib2 from '../map/lib/map_station';
import * as ChartLib from '../boxplot/lib/chart.js'
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
  public plotbox = [];
  public plotout = [];
  public plotname = [];
  public boxval = [];
  public outval = [];
  public nameval = [];
  public anomalydata = []
  public anomaly = []
  public anomalyyear = []
  public st;
  public stationan = [];
  dat:any;
  co:any;
  public colorlist = ['#CCFFFF', '#dec183', '#0661CC', '#614215']

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
  constructor( public formatter:NgbDateParserFormatter, private tempService: TempService, private fb: FormBuilder) {
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
        }else if(String(v) == String('รายฤดู')){
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
          }
          this.boxval.push(v)
          })
        })
        this.plotname.map(v=>{
          for(let i of v){
            this.nameval.push(i)
          }
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
        })
      })
      }))
      return this.boxval
    }
  
     public anomaly_year = []
     public anomaly_name = [];
     
     async plotbar(){
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
          ChartLib.bar_chart(this.anomalyyear,this.anomaly_name,this.anomalydata)

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
      yAxis: {
        min: -10,
        max: 10,
        startOnTick: false,
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
      ],
      credits: {
        enabled: false
    }
   };
  

}
