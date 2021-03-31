import * as Highcharts from 'highcharts';
var highchartsRegression = require("highcharts-regression")
highchartsRegression(Highcharts)

export function draw_seasonal_chart(target,anomalydata,anomaly_year, fileanomaly) {
    console.log("draw_seasonal_chart")
    var chart = new Highcharts.chart(target, {
        chart: {
            type: 'column',
        },
        title: {
          text: '',
          style: {
              display: 'none'
          }
        },
        xAxis: {
            categories: anomaly_year
        },
        series: [
          {
             name: fileanomaly,
             data: anomalydata,
             zones: [{
                 value: -0,
                 color: '#306EFF'
             }, {
                 color: '#E42217'
             }]
          }
       ]
    })
    return chart
    // return chart
  }
