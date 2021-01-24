import * as Highcharts from 'highcharts';


export function convert_to_geojson(data) {
    console.log("box.js work!")
    console.log(" data input : ", data)
    // console.log("data : ",data)
    
    var chartOptions = {
        chart: {
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
        xAxis: [],
        yAxis: {
            title: {
                text: 'Observations'
            },
        },
        series: []
    }
    let bv = []
    let outv = []
    let b = {}
    for (let i in data) {
        if (i == 0) {
            // console.log(data[0])
            for (let b of data[0]) {
                // console.log("b : ",b.station)
                for (bv of b.value) {
                    // console.log("bv : ",bv)
                    for (let j in bv) {
                        if (String(bv[j]) == String('-')) {
                            bv[j] = null
                        }
                    }
                }
                for (outv of b.outliers) {
                    // console.log("outv : ",outv)
                    for (let j in outv) {
                        for (let l in outv[j]){
                            if (String(outv[j][l]) == String('-')) {
                                outv[j][l] = null
                            }
                        }
                    }
                    // console.log("new outv : ",outv) 
                }
                chartOptions.series.push(
                    {
                        name: //b.station
                        'obs',
                        data: //b.value
                            [[null, null, null, null, null],
                            [23.5, 24.6, 25.5, 26.175, 27.6],
                            [21.1, 23, 23.8, 24.8, 26.4],
                            [20, 21.29997, 22.4, 23.4, 24],
                            [21.2, 22.3, 23.29999997, 24.700003, 25.7],
                            [25, 26.1, 26.6, 27.35, 29.225],
                            [26.7, 28.7, 29.5, 30.55, 31.8],
                            [25.5, 28.05, 28.6, 29.75, 32.2]]
                        ,
                        tooltip: { headerFormat: '<em>Month No {point.key}</em><br/>' }
                    },
                    {
                        name: 'Outliers'+b.station,
                        color: '##06AEC4',
                        type: 'scatter',
                        data: //b.outliers
                            [[0, 17],
                            [0, 16.2]]
                        ,
                        marker: {
                            fillColor: '#8DC3D9',
                            lineWidth: 1,
                            lineColor: '#8DC3D9'
                        },
                        tooltip: { pointFormat: 'Observation: {point.y}' }
                    }
                )
            }

        }
        if (i == 1){
            for (let j in data[1]){
                chartOptions.xAxis.push(
                    {
                        categories: "tt",
                        //data[1][j],
                        title: {
                            text: 'Month No.'
                        }
                    }
                )                
            }
        }

    }

    //   console.log('json data : ',chartOptions)
    return chartOptions
}

export function plot_box(dat){
    console.log("dat plot : ",dat)
    var highcharts = Highcharts
    var chartOptions = dat
    console.log("plot box func")
    return highcharts,chartOptions
}