import { Component, OnInit , OnChanges, Input} from '@angular/core';
import {Config, Data, Layout} from 'plotly.js';
import { Chart,ChartData } from 'chart.js';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as ChartLib from './lib/chart.js';
import * as Highcharts from 'highcharts';
import * as highheat from 'highcharts/modules/heatmap';
import { HighchartsChartComponent } from 'highcharts-angular';
import { TempService } from 'src/app/services/temp.service';
import { InputService } from 'src/app/services/input.service';

@Component({
  selector: 'app-missingvalue',
  templateUrl: './missingvalue.component.html',
  styleUrls: ['./missingvalue.component.css'],
  providers:[TempService]
})
export class MissingvalueComponent implements OnInit {

   missed_chart: any;

   constructor(private sharedData: InputService ) { 
  }

  async ngOnInit(){ 
     console.log("Init chart")
   await this.sharedData.missedvalueservice.subscribe(data => {
      if(data){
         console.log("missing station :",data) //อันนี้ดึงมาทั้งก้อน
         console.log("miss chart >>>", this.missed_chart)
      this.missed_chart = ChartLib.missing_chart(data)
      console.log("miss chart >>>", this.missed_chart)
      }})
     
    }  
   
 }
