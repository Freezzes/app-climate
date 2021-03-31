import { Component, OnInit,Input } from '@angular/core';
import { DataService } from '../services/data.service';
import * as CanvasJS from 'C:/Users/Mewkk/Downloads/canvasjs-3.2.8/canvasjs.min';
import { InputService } from "src/app/services/input.service";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  providers: [DataService]
})
export class GraphComponent implements OnInit {
  // @Input() data: string;
  // @Input() file: string;
  // @Input() startyear: string;
  // @Input() start_date: string;
  // @Input() stop_date: string
  // @Input() stopyear: string;
  // @Input() startmonth: string;
  // @Input() stopmonth: string;

  constructor(
    private sharedData:InputService
  ) { }
  
  public get;
  public Data;
  public value_avg;
  public dataTemp;
  public dataMean;
  public dataMeanDB;
  public name = ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec'];

  async ngOnInit() {
    this.sharedData.graphAvgservice.subscribe(data => {
      if (data){
      this.plotMean(data[0],data[1],data[2])
      }
    })

    // this.sharedData.graphcountryservice.subscribe(data => {
    //   if (data){
    //   this.plotMean(data.global_avg[0],data.global_avg[1],data.global_avg[2])
    //   }
    // })

    

    // await this.tempService.global_avg(this.data, this.file, this.startyear, this.startmonth, this.stopyear, this.stopmonth)
    // .then(data => data.subscribe(res => {
    //   console.log("global",res)
    //   var data = Number(this.stopyear)- Number(this.startyear)
    //   console.log("dddddd",data)
    //   var start = Number(this.startyear)
    //   for (var i =0; i<= data; i++){
    //     this.Data.dataPoints.push(
    //       {x: new Date(start, 0), y: res[0][i]},
       
    //     )
    //     start+=1
    //   }
    //   console.log("point",this.Data.dataPoints)
    //   this.plotMean(res[1],res[2])
    // }))

    // this.Data = {
    //   // value:[],
    //   dataPoints : []
    // }

    // await this.plotMean()
    
  }

  //---------------------------------------------------------------------------------------------------

  async plotMean(Data,Avg,unit) {
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
        dataPoints: Data
      }]
    });
    chart.render();
  }

  // async datapoint(){
  //   await this.tempService.global_avg(this.data, this.file, this.startyear, this.startmonth, this.stopyear, this.stopmonth)
  //   .then(data => data.subscribe(res => {
  //     console.log("global",res)
  //     var data = Number(this.stopyear)- Number(this.startyear)
  //     console.log("dddddd",data)
  //     for (var i =0; i< data; i++){
  //       this.Data.dataPoints.push(
  //         {x: new Date(data[i], 0), y: res[0][i]},
  //       )
  //     }
  //   }))

  //   this.Data = {
  //     value:[],
  //     dataPoints : []
  //   }
    
  //   console.log("datapoints",this.Data.dataPoints)
  //   // console.log("Avg",this.Data.value)
  // }

}
