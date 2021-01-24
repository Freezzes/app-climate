export function convert_to_geojson() {
    var chartOptions = {   
        chart : {
          type: 'boxplot',
          marginTop: 40,
          marginBottom: 100,
  
        },

      title: {
          text: 'Box Plot'
      },
  
      legend: {
          enabled: false
      },
  
      xAxis: {
          categories: "name",
          title: {
              text: 'Month No.'
          }
      },
  
      yAxis: {
          title: {
              text: 'Observations'
          },
      },
      
      series: [{
          name: 'Observations',
          data: //this.boxval
          [[null, null, null, null, null],
          [23.5, 24.6, 25.5, 26.175, 27.6],
          [21.1, 23, 23.8, 24.8, 26.4],
          [20, 21.29997, 22.4, 23.4, 24],
          [21.2, 22.3, 23.29999997, 24.700003, 25.7],
          [25, 26.1, 26.6, 27.35, 29.225],
          [26.7, 28.7, 29.5, 30.55, 31.8],
          [25.5, 28.05, 28.6, 29.75, 32.2]]
          ,
          tooltip: {
              headerFormat: '<em>Month No {point.key}</em><br/>'
          }
      }, {
          name: 'Outliers',
          color: '#000000',
          type: 'scatter',
          data: 
            [[0, 17],
            [0, 16.2]]
          ,
          marker: {
              fillColor: 'lightblue',
              lineWidth: 1,
              lineColor: '#000000'
          },
          tooltip: {
              pointFormat: 'Observation: {point.y}'
          }
      }]
      
  }
 console.log("test chartoptions : ",chartOptions)
  return chartOptions
}
import * as Highcharts from 'highcharts';
// highheat(Highcharts);
export function plot_box(dat){
    console.log("dat plot : ",dat)
    var highcharts = Highcharts
    var chartOptions = dat
    console.log("plot box func")
    return highcharts,chartOptions
}
