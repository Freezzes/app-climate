import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);

export function box_chart(boxval,nameval,outval,ts,colorplot,colorline){
   Highcharts.chart('box-container', {
      chart: {
        type: 'boxplot',
        marginTop: 40,
        marginBottom: 80,
        plotBorderWidth: 1
      },
      title: {
           text: 'Boxplot',
      },
      legend: {
        enabled: false
      },
      xAxis: {
        categories: nameval,
        title: {
            text: ts
        }
      },
      yAxis: {
        title: {
            text: 'Observations'
        },
        min: 0
      },
      series: [{
        name: 'Observations',
        fillColor: colorplot,
        color:colorline,
        data: boxval,
        tooltip: {
            headerFormat: '<em>Month No {point.key}</em><br/>'
        }
        }, {
        name: 'Outliers',
        type: 'scatter',
        data: outval,
        marker: {
            fillColor: colorplot,
            lineWidth: 1,
            lineColor: colorline
        },
        tooltip: {
            pointFormat: 'Observation: {point.y}'
        }
        }],
        credits: {
            enabled: false
        }
      });   
}

export function bar_chart(anomalyyear,anomaly_name,anomalydata){
  Highcharts.chart('bar-container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Anomaly'
     },
     xAxis:{
        categories: anomalyyear
     },  
     yAxis: {
       min: -2,
       max: 2,
      //  startOnTick: false,
     },   
     series: [{
           name: anomaly_name,
           data: anomalydata,
           zones: [{
               value: -0,
               color: '#306EFF'
           }, {
               color: '#E42217'
           }]
        }
     ],
     credits: {
       enabled: false
   }
  })
}
