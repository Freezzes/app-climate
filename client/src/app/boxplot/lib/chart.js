import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);

export function box_chart(boxval,nameval,outval,ts,colorplot,colorline){
   console.log("data plot box >>>")
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
