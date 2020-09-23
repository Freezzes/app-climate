import { Component, OnInit } from '@angular/core';
import * as Plotly from 'plotly.js';
import {Config, Data, Layout} from 'plotly.js';
import { Chart,ChartData } from 'chart.js';
import * as CanvasJS from 'C:/Users/Mewkkn/Downloads/canvasjs-3.0/canvasjs.min';


@Component({
  selector: 'app-boxplot',
  templateUrl: './boxplot.component.html',
  styleUrls: ['./boxplot.component.css']
})

export class BoxplotComponent implements OnInit {
  
  constructor() { }
  
  ngOnInit(): void {

    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      title:{
        text: "Annual Salary Range - USA"
      },
      axisY: {
        title: "Annual Salary (in USD)",
        prefix: "$",
        interval: 40000
      },
      data: [{
        type: "boxAndWhisker",
        upperBoxColor: "#FFC28D",
        lowerBoxColor: "#9ECCB8",
        color: "black",
        yValueFormatString: "$#,##0",
        dataPoints: [
          { label: "Registered Nurse", y: [46360, 55320, 82490, 101650, 71000] },
          { label: "Web Developer", y: [83133, 91830, 115828, 128982, 101381] },
          { label: "System Analyst", y: [51910, 60143, 115056, 135450, 85800] },	
          { label: "Application Engineer", y: [63364, 71653, 91120, 100556, 80757] },
          { label: "Aerospace Engineer", y: [82725, 94361, 118683, 129191, 107142] },
          { label: "Dentist", y: [116777, 131082, 171679, 194336, 146794] }
        ]
      }]
    });
    chart.render();
    }
  }

