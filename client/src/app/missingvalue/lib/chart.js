import * as Highcharts from 'highcharts';
import * as highheat from 'highcharts/modules/heatmap';
highheat(Highcharts);


export function missing_chart(percentplot){
   console.log("data >>>", percentplot)
   Highcharts.chart('container', {
      chart: {
          type: 'heatmap',
          marginTop: 40,
         //  marginBottom: 80,
          plotBorderWidth: 1
      },
      title: {
           text: '',
           style: {
               display: 'none'
           }
      },
         xAxis : {
           categories: [300201,300202,303201,303301,310201,327202,327301,327501,328201,328202, 328301, 329201, 
            330201,331201, 331301, 331401, 331402, 351201,352201, 353201, 353301, 354201, 356201, 356301,357201, 
            357301, 373201, 373301, 376201, 376202, 376203, 376301, 376401, 378201, 379201,379401, 379402, 380201, 
            381201, 381301, 383201, 386301, 387401, 388401, 400201, 400301, 402301,403201, 405201,405301, 407301, 
            407501, 409301,415301, 419301, 423301, 424301, 425201,425301,426201, 426401, 429201,429601, 430201,430401,
            431201, 431301, 431401,432201, 432301, 432401, 436201, 436401, 440201, 440401, 450201,450401,451301, 
            455201, 455203, 455301, 455302, 455601,459201, 459202, 459203, 459204, 459205, 465201,478201, 478301, 
            480201, 480301, 500201, 500202,500301, 501201, 517201, 517301, 532201, 551203, 551301, 551401, 552201, 
            552202, 552301, 552401,560301, 561201, 564201, 564202, 566201,566202,567201, 568301, 568401, 568501, 568502, 
            570201, 580201, 581301, 583201],
            labels: {
              rotation: -90,
             step:1,
              style: {
                  fontSize:'8px'
               }
            },
            title: {
               text: 'Station ID.'
            }
         },
         yAxis : {
           categories: [1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,
            1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,
            2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015],
            title: {
               text: 'Year'
            }
         },   
      colorAxis: {
         min: 0,
         max:100,
         minColor: '#E3F2FD',
         maxColor: '#0661CC',
         dataClasses: [{
            from: null,
            to: null,
            name: "Don't Collect data",
            color: "#000000"
         },{ from: 0,   to: 10,
            // color: '#3949AB'
         },{ from: 10,  to: 20,
            // color: '#7986CB'
         },{ from: 20,  to: 30,
            // color: '#8C65D3'                         
         },{ from: 30,  to: 40,
            // color: '#B39DDB'                                   
         },{ from: 40,  to: 50,
            // color: '#42A5F5'                          
         },{ from: 50,  to: 60,
            // color: '#1976D2'                           
         },{ from: 60,  to: 70,
            // color: '#00838F'                          //   '#8C9EFF '
         },{ from: 70,  to: 80,
            // color: '#00ACC1'                       
         },{ from: 80,  to: 90,
            // color : '#B3E5FC'
         },{ from: 90,  to: 100,
            // color: '#E3F2FD'
         }
      ],
     },
        legend : {
            title: {
                  text: 'Percent Missing Value',
                  style: {
                     fontSize:'10px'
                  }
            },
            padding: 15,
            marginTop:25,
            // borderColor: '#0661CC',
            // borderRadius: 5,
            // borderWidth: 1,
            verticalAlign: 'bottom',
            align: 'center',
            layout: 'horizontal',
            // margin: 1,
            valueDecimals: 0,
            // verticalAlign: 'top',
            y: 25,
            symbolRadius: 0,
            symbolHeight: 14,
            labelFormatter: function () {
               if(this.name != "Don't Collect data"){
                  return this.name + ' %';
              }else{
                  return this.name
              }               
           }
        },
        tooltip: {
         formatter: function () { 
           return 'Station <b>'  + this.series.xAxis.categories[this.point.x] +  '</b> <br> Missing <b>' +
             this.point.value + '% </b><br> in year<b>' + this.point.y + '</b>';
         }
       },
        series : [{
           name: 'missing',
           borderWidth: 1,
           turboThreshold:0,
           borderColor:'#FFFFFF',
           nullColor:'#000000',
           data: percentplot,       
           dataLabels: {
              enabled: false,
              color: '#000000'
           }
        }],
        credits: {
            enabled: false
        }
    });   
}
