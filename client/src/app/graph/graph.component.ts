import { Component, OnInit,Input } from '@angular/core';
import { TempService } from '../services/temp.service';
import * as CanvasJS from 'C:/Users/Mewkk/Downloads/canvasjs-3.2.8/canvasjs.min';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { map } from 'rxjs/operators';
import { Chart } from 'chart.js';
import { from, range } from 'rxjs';
import * as $ from 'jquery';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  providers: [TempService]
})
export class GraphComponent implements OnInit {
  @Input() data: string;
  @Input() file: string;
  @Input() startyear: string;
  @Input() start_date: string;
  @Input() stop_date: string
  @Input() stopyear: string;
  @Input() startmonth: string;
  @Input() stopmonth: string;

  constructor(
    private tempService: TempService
  ) { }
  
  public get;
  public Data;
  public value_avg;
  public dataTemp;
  public dataMean;
  public dataMeanDB;
  public name = ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec'];

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

    // await this.plotMean()
    
  }

  //---------------------------------------------------------------------------------------------------

  async plotMean(Avg,unit) {
    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,  
      title:{
        text: "Area averange time series"
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
    
    // function range(start, stop, step) {
    //   if (typeof stop == 'undefined') {
    //     // one param defined
    //     stop = start;
    //     start = 0;
    //   }
    //   if (typeof step == 'undefined') {
    //     step = 1;
    //   }
    //   if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    //     return [];
    //   }

    //   var result = [];
    //   for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
    //     result.push(i);
    //   }

    //   return result;
    // };

    // var data = range(this.startyear, this.stopyear, 1)
    // var values = [2798000,3386000,6944000,6026000]
    // var total = 0;
    // for(var i = 0; i < values.length; i++) {
    //     total += values[i];
    // }
    // var avg = total / values.length;
    // for (var i =0; i< data.length; i++){
    //   this.Data.dataPoints.push(
    //     {x: new Date(data[i], 0), y: values[i]},
    //   )
    // }
    // this.Data.value.push(avg)
    // console.log("range",data)
    console.log("datapoints",this.Data.dataPoints)
    // console.log("Avg",this.Data.value)
  }

}
