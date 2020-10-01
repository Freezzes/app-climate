import { Component, OnInit, OnChanges, ElementRef, SimpleChanges, NgZone } from '@angular/core';
import { TempService } from '../services/temp.service';
import * as CanvasJS from 'C:/Users/Mewkkn/Downloads/canvasjs-3.0/canvasjs.min';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { map } from 'rxjs/operators';
import { Chart, ChartData } from 'chart.js';
import { from, range } from 'rxjs';
import "chartjs-chart-box-and-violin-plot/build/Chart.BoxPlot.js";


@Component({
  selector: 'app-graph',
  templateUrl: './styles/graph.component.html',
  styleUrls: ['./styles/graph.component.css'],
  providers: [TempService]
})
export class GraphComponent implements OnInit {

  constructor(
    private tempService: TempService,
  ) { }

  public dataTemp;
  public dataMean;
  public dataMeanDB;
  public dataVarmonth
  public name = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public march = [];
  public april = [];
  public may = [];

  async ngOnInit() {
    this.dataTemp = await this.tempService.getTemp();
    this.dataMean = await this.tempService.getMean();
    this.dataMeanDB = await this.tempService.getMeanDB();
    this.dataVarmonth = await this.tempService.getVarMonth();
    // this.build();
  }

  async Boxplot() {
    let result = [];
    let result1 = [];
    let result2 = [];
    let result3 = [];
    let Mar = [];
    let Mar1 = [];
    let Mar2 = [];
    let Mar3 = [];
    let Apr = [];
    let Apr1 = [];
    let Apr2 = [];
    let Apr3 = [];
    let May = [];
    let May1 = [];
    let May2 = [];
    let May3 = [];
    console.log(this.dataTemp)
    await this.dataVarmonth.map(data => {
      console.log(this.dataVarmonth)
      console.log(data)
      data.map(v => {
        console.log(v)
        // console.log(year)
        for (var mons of v[2012]) {
          result.push(mons)
          // console.log(result)
          Mar = result.map(({ Dec }) => Dec)
          Apr = result.map(({ Jan }) => Jan)
          May = result.map(({ Feb }) => Feb)

        }
        console.log(Mar)
        for (var mons of v[2013]) {
          result1.push(mons)
          // console.log(result)
          Mar1 = result1.map(({ Dec }) => Dec)
          Apr1 = result1.map(({ Jan }) => Jan)
          May1 = result1.map(({ Feb }) => Feb)
        }
        for (var mons of v[2014]) {
          result2.push(mons)
          Mar2 = result2.map(({ Dec }) => Dec)
          Apr2 = result2.map(({ Jan }) => Jan)
          May2 = result2.map(({ Feb }) => Feb)

        }
        for (var mons of v[2015]) {
          result3.push(mons)
          Mar3 = result3.map(({ Dec }) => Dec)
          Apr3 = result3.map(({ Jan }) => Jan)
          May3 = result3.map(({ Feb }) => Feb)

        }
        console.log(May)
        console.log(May1)
        console.log(May2)

      })
    })

    let box = new Chart('Boxplots', {
      type: 'boxplot',
      data: {
        labels: ["2012", "2013", "2014", "2015"],
        datasets: [{
          label: "Mar",
          type: "boxplot",
          backgroundColor: "#FF9999",
          borderColor: 'black',
          data: [Mar, Mar1, Mar2, Mar3]
        }, {
          label: "Apr",
          type: "boxplot",
          backgroundColor: "#99FFFF",
          borderColor: 'black',
          data: [Apr, Apr1, Apr2, Apr3]
        },
        {
          label: "May",
          type: "boxplot",
          backgroundColor: "#66FFCC",
          borderColor: 'black',
          data: [May, May1, May2, May3]
        }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Temperature in Winter of 2012-2015'
        },
        // legend: { display: false }
      }
    })
  }
  // console.log(Mar)



  // -----------------------------------------------------------------------------------------------------------------
  async plotMean() {
    let dataPoints1 = []
    let dataPoints2 = []
    let dataPoints3 = []
    let dataPoints4 = []
    this.dataMean.map(u => {
      u.map(v => {
        dataPoints1.push({
          y: v.y2012
        }),
          dataPoints2.push({
            y: v.y2013
          }),
          dataPoints3.push({
            y: v.y2014
          }),
          dataPoints4.push({
            y: v.y2015
          })
      })
    })
    console.log(dataPoints1)
    let chart = new CanvasJS.Chart("linechartContainer", {
      zoomEnabled: true,
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Averange Temperature of 300201"
      },

      data: [
        {
          type: "line",
          name: "2012",
          showInLegend: true,
          dataPoints: dataPoints1
        },
        {
          type: "line",
          name: "2013",
          showInLegend: true,
          dataPoints: dataPoints2
        },
        {
          type: "line",
          name: "2014",
          showInLegend: true,
          dataPoints: dataPoints3
        },
        {
          type: "line",
          name: "2015",
          showInLegend: true,
          dataPoints: dataPoints4
        }]
    });
    chart.render();
  }

  // ------------------------------------------------------------------------------------------------------------------------

  async plotBar() {
    let s300201 = [];
    let s432301 = [];
    let s583201 = [];
    await this.dataMeanDB.map(data => {
      for (var station in data) {
        // console.log(station)
        if (String(station) == "300201") {
          for (var index in data[300201]) {
            s300201.push({
              y: data[300201][index]
            })
          }
        }
        if (String(station) == "432301") {
          for (var index2 in data[432301]) {
            s432301.push({ y: data[432301][index2] })
          }
        }
        if (String(station) == "583201") {
          for (var index3 in data[583201]) {
            s583201.push({ y: data[583201][index3] })
          }
        }
      }
    })
    // console.log("300201",s300201)
    // console.log("432301",s432301)
    // console.log("583201",s583201)
    let chart = new CanvasJS.Chart("chartContainer", {
      zoomEnabled: true,
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Averange Temperature of 300201"
      },
      subtitles: [{
        text: "Average temperature from 2012 to 2015"
      }],
      axisX: {
        title: "Month"
      },
      data: [
        {
          type: "column",
          name: "2012-2015",
          dataPoints: s300201,
          label: s300201,
        },
        {
          type: "column",
          name: "432301",
          showInLegend: true,
          dataPoints: s432301
        },
        {
          type: "column",
          name: "583201",
          showInLegend: true,
          dataPoints: s583201
        }]
    }
    );
    // console.log("val", s300201)
    chart.render();
  }
}
