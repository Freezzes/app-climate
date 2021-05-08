import { Component, OnInit , OnChanges, Input} from '@angular/core';
import {Config, Data, Layout} from 'plotly.js';
import { Chart,ChartData } from 'chart.js';
import * as CanvasJS from 'C:/Users/ice/Downloads/cli/canvasjs-3.0.5/canvasjs.min';
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
   
 }
