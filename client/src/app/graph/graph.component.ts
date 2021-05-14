import { Component, OnInit,Input } from '@angular/core';
import { DataService } from '../services/data.service';
import * as CanvasJS from 'C:/Users/Mewkk/Downloads/canvasjs-3.2.8/canvasjs.min';
import { InputService } from "src/app/services/input.service";
import { Title } from '@angular/platform-browser';

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
  
  public value;
  public year;
  public name;
  public Data;
  public dataMean;
  unit;
  // public name = ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec'];

  async ngOnInit() {

    await this.sharedData.Detailservice.subscribe(data => {
      // this.details = data
      // this.color_map = data.color_map
      console.log("input Detail", data[0])
      if (data) {
        // console.log("input Detail",data)
        this.unit = data[0].unit
        // this.difinition = data[0].description
        // this.long_name = data[0].long_name
        // this.year = data[0].year
        // this.dataset_name = data[0].dataset
        // this.color_map = data[0].color_map
        // this.index = data[2].index
        // console.log("difinition", this.difinition)
      }
    })
    this.sharedData.graphAvgservice.subscribe(data => {
      if (data){
        console.log("graph",data)
      this.plotMean(data[0],data[1],this.unit,data[3])
      // this.plot_anomaly()
      }
    })

    this.sharedData.anomalyservice.subscribe(data => {
      if(data){
        this.value = data.value
        this.name = data.name
        this.year = data.year
        this.Data = {
          dataPoints : []
        }
        for (var i =0; i< data.value.length; i++){
          this.Data.dataPoints.push(
            { y: this.value[i], label: this.year[i] }          
          )
        }
        this.plot_anomaly(this.Data.dataPoints,this.name)
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

  async plot_anomaly(value,name){

    var chart = new CanvasJS.Chart("anomaly", {
      animationEnabled: true,
      
      title:{
        text:name
      },
      axisX:{
        // interval: 1,
        title : 'Year'
      },
      axisX2:{
        // interlacedColor: "rgba(1,77,101,.2)",
        gridColor: "rgba(1,77,101,.1)",
        title: "Number of Companies"
      },
      axisY:{
        title : "tempurature"
       },
      data: [{
        type: "column",
        name: "companies",
        // axisYType: "secondary",
        color: "#014D65",
        dataPoints: value
      }]
    });
    chart.render();
  }


  async plotMean(Data,Avg,unit,country) {
    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,  
      title:{
        text: "Area averange time series of"+" "+country,
        size: 5
      },
      axisY: {
        // title: "Averange temperature",
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
        // showInLegend: true,
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
