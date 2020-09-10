import { Component, OnInit } from '@angular/core';
import Plotly from 'plotly.js-dist'
import { TempsService } from "../temp/temp.service";
import * as CanvasJS from 'C:/Users/Mewkkn/Downloads/canvasjs-3.0/canvasjs.min';


@Component({
  selector: 'app-plotly',
  templateUrl: './plotly.component.html',
  styleUrls: ['./plotly.component.css'],
  providers: [TempsService]
})
export class PlotlyComponent implements OnInit {

  constructor(private tempsService: TempsService) { }

  public data;

  ngOnInit(): void {
    this.tempsService.getmean().subscribe(data => { this.data = data })

    Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/volcano_db.csv', function(err, rows){
      function unpack(rows, key) {
          return rows.map(function(row) { return row[key]; });
      }

      // let y = 0;
      // let dataPoints1 = []
      // let dataPoints2 = []
      // let dataPoints3 = []
      // let dataPoints4 = []
      // this.data.map(u=>{
      //   dataPoints1.push({
      //     y:u.y2012
      //   }),
      //   dataPoints2.push({
      //     y:u.y2013
      //   }),
      //   dataPoints3.push({
      //     y:u.y2014
      //   }),
      //   dataPoints4.push({
      //     y:u.y2015
      //   })
      // }

  //   var trace1 = {
  //     type : 'scatter',
   
  //     zoomEnabled: true,
  //     animationEnabled: true,
  //     exportEnabled: true,
  //     title: {
  //       text: "Averange Temperature of 300201"
  //     },
  //     subtitles: [{
  //       text: "Try Zooming and Panning"
  //     }],
  //     data: [
  //       {
  //         type: "line",
  //         name: "2012",
  //         showInLegend: true,
  //         dataPoints: dataPoints1
  //         },
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
  //   } 

  var x = unpack(rows, 'Elev');
    
  var trace2 = {
      x: unpack(rows, 'Elev'),
      type: 'histogram',
      hoverinfo: 'x+y',
      showlegend: false,
      xaxis: 'x2',  
      yaxis: 'y2',
    marker: {
      color: 'red'
    }}; 

  var trace3 = {
      geo: 'geo3',
      type:'scattergeo',
      locationmode: 'world',
      lon: unpack(rows, 'Longitude'),
      lat: unpack(rows, 'Latitude'),
      hoverinfo:  'text',
      text:  unpack(rows, 'Elev'),
      mode: 'markers',
      showlegend: false,
      marker: {
        size: 4,
        color: unpack(rows, 'Elev'),
        colorscale: 'Reds',
        opacity: 0.8,
        symbol: 'circle',
        line: {
          width: 1
        }
      }
  };  

  var data = [trace2 ];

  var layout = {
        paper_bgcolor: 'black',
        plot_bgcolor: 'black',
        title: 'Volcano Database: Elevation',
        font: {color: 'white'},
        colorbar: true,
        annotations: [{
          x: 0,
          y: 0,
          xref: 'paper',
          yref: 'paper',
          text: 'Source: NOAA',
          showarrow: false
        }],
        geo3: {
          domain: {
        x: [0, 0.45], 
        y: [0.02, 0.98]
        },
          scope: 'world',
          projection: {
            type: 'orthographic'
          },
          showland: true,
          showocean: true,
          showlakes: true,
          landcolor: 'rgb(250,250,250)',
          lakecolor: 'rgb(127,205,255)',
          oceancolor: 'rgb(6,66,115)',
          subunitcolor: 'rgb(217,217,217)',
          countrycolor: 'rgb(217,217,217)',
          countrywidth: 0.5,
          subunitwidth: 0.5,
          bgcolor: 'black'
        }, 
    scene: {domain: {
        x: [0.55, 1], 
        y: [0, 0.6]
      },
          xaxis: {title: 'Status',
                  showticklabels: false,
                  showgrid: true,
                  gridcolor: 'white'},
          yaxis: {title: 'Type',
                  showticklabels: false,
                  showgrid: true,
                  gridcolor: 'white'},
          zaxis: {title: 'Elev',
                  showgrid: true,
                  gridcolor: 'white'}
        },
    yaxis2: {
      anchor: 'x2', 
        domain: [0.1, 1],
        showgrid: false
    },
    xaxis2: {
        tickangle: 45,
        anchor: 'y2',
      ticksuffix: 'm',
        domain: [0.6, 1]},
  };
    
  Plotly.newPlot("myDiv", data, layout, {showLink: false});
    
  });
  }
}
