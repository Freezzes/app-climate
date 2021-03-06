import { Component, OnInit } from '@angular/core';
import { TempService } from '../services/temp.service';
import * as CanvasJS from 'C:/Users/ice/Downloads/canvasjs-3.0.5/canvasjs.min';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { map } from 'rxjs/operators';
import { Chart } from 'chart.js';
import { from, range } from 'rxjs';
import "chartjs-chart-box-and-violin-plot/build/Chart.BoxPlot.js";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  providers: [TempService]
})
export class GraphComponent implements OnInit {

  constructor(
    private tempService: TempService
  ) { }

  public dataTemp;
  public dataMean;
  public dataMeanDB;
  public name = ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec'];

  async ngOnInit() {
    this.dataTemp = await this.tempService.getTemp();
    this.dataMean = await this.tempService.getMean();
    this.dataMeanDB = await this.tempService.getMeanDB();
  }

  //---------------------------------------------------------------------------------------------------

  async plotMean() {
    let dataPoints1 = []
    let st300201 = [];
    let s432301 = [];
    await this.dataTemp.map(data=>{
      data.map(v=> {
        st300201.push({
          y:v.s300201
        })
        // for ( var station in data) {
        //   if(String(station)=="300201"){
        //     s300201.push({y:v.s300201})
            // for (var index in data[300201]) {
            //   s300201.push({
            //     y:data[300201][index]
            //   })
            // }
          }
          // if(String(station)=="432301"){
          //   for (var index2 in data[432301]) {
          //     s432301.push({y:data[432301][index2]})
          //   }
          // }
      )})

    // console.log()
     
    let chart = new CanvasJS.Chart("chartContainer", {
      title: {
        text: "Energy Consumption"
      },
      axisY: {
        title: "Energy Consumption (in kWh)"
      },
      dataPointMaxWidth: 20,
      data: [
      {
        type: "boxAndWhisker",
        upperBoxColor: "#FF5A4D",
        lowerBoxColor: "#7BCE69",
        color: "black",
        yValueFormatString: "##.## kWh",
        dataPoints: [
        { label: "Oven", y: [4, 6, 8, 9, 7] },
        { label: "Microwawe", y: [5, 6, 7, 8, 6.5] },
        { label: "PC & Peripherals", y: [6, 8, 10, 11, 9.5] },
        { label: "Air Conditioner", y: [8, 9, 13, 14, 10.5] },
        { label: "Dishwasher", y: [5, 7, 9, 12, 7.5] },
        { label: "Shaver", y: [2, 3, 4, 6, 3.5] },
        { label: "Electric Kettle", y: [4, 6, 8, 9, 7] },
        { label: "Fridge", y: [8, 9, 12, 13, 11] }
        ]
      }
      ]
    });
    chart.render();
  }
}


  // async plotMean() {
  //   let dataPoints1 = []
  //   let dataPoints2 = []
  //   let dataPoints3 = []
  //   let dataPoints4 = []
  //   this.dataMean.map(u => {
  //     u.map( v => {
  //       dataPoints1.push({
  //         y: v.y2012
  //       }),
  //       dataPoints2.push({
  //         y: v.y2013
  //       }),
  //       dataPoints3.push({
  //         y: v.y2014
  //       }),
  //       dataPoints4.push({
  //         y: v.y2015
  //       })
  //     })
  //   })

  //   let chart = new CanvasJS.Chart("linechartContainer", {
  //     zoomEnabled: true,
  //     animationEnabled: true,
  //     exportEnabled: true,
  //     title: {
  //       text: "Averange Temperature of 300201"
  //     },
    
  //     data: [
  //       {
  //         type: "line",
  //         name: "2012",
  //         showInLegend: true,
  //         dataPoints: dataPoints1
  //       },
  //       {
  //         type: "line",
  //         name: "2013",
  //         showInLegend: true,
  //         dataPoints: dataPoints2
  //       },
  //       {
  //         type: "line",
  //         name: "2014",
  //         showInLegend: true,
  //         dataPoints: dataPoints3
  //       },
  //       {
  //         type: "line",
  //         name: "2015",
  //         showInLegend: true,
  //         dataPoints: dataPoints4
  //       }]
  //   });
  //   chart.render();
  // }

  // async plotBar(){
  //   let s300201 = [];
  //   let s432301 = [];
  //   let s583201 = [];
  //   await this.dataMeanDB.map(data=>{
  //     for ( var station in data) {
  //         if(String(station)=="300201"){
  //           for (var index in data[300201]) {
  //             s300201.push({
  //               y:data[300201][index]
  //             })
  //           }
  //         }
  //         if(String(station)=="432301"){
  //           for (var index2 in data[432301]) {
  //             s432301.push({y:data[432301][index2]})
  //           }
  //         }
  //         if(String(station)=="583201"){
  //           for (var index3 in data[583201]) {
  //             s583201.push({y:data[583201][index3]})
  //           }
  //         }
  //     }
  //   })
  //   console.log("300201",s300201)
  //   console.log("432301",s432301)
  //   console.log("583201",s583201)
  //   let chart = new CanvasJS.Chart("chartContainer", {
  //     zoomEnabled: true,
  //     animationEnabled: true,
  //     exportEnabled: true,
  //     title: {
  //       text: "Averange Temperature of 300201"
  //     },
  //     subtitles: [{
  //       text: "Average temperature from 2012 to 2015"
  //     }], 
  //     axisX: {
  //       title: "Month"
  //     },
  //     data: [
  //       {
  //         type: "column",
  //         name: "2012-2015",
  //         dataPoints: s300201,
  //         label: s300201,
  //       }]
  //       // {
  //       //   type: "column",
  //       //   name: "432301",
  //       //   showInLegend: true,
  //       //   dataPoints: s432301
  //       // },
  //       // {
  //       //   type: "column",
  //       //   name: "583201",
  //       //   showInLegend: true,
  //       //   dataPoints: s583201
  //       // }]
  //   });
  //   console.log("val", s300201)
  //   chart.render();
  // }
