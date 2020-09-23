import { Component, OnInit } from '@angular/core';
import { Chart,ChartData } from 'chart.js';
import * as ol from 'openlayers';

@Component({
  selector: 'app-mixed-chart',
  templateUrl: './mixed-chart.component.html',
  styleUrls: ['./mixed-chart.component.css']
})
export class MixedChartComponent implements OnInit {

  constructor() { }
  // public canvas : any = document.getElementById("mixed-chart");
  ngOnInit(): void {
    var epsgCode = 'EPSG:4326', // UTM 33N
    projection = ol.proj.get(epsgCode),
    projectionExtent = projection.getExtent(),
    size = ol.extent.getWidth(projectionExtent) / 256,
    resolutions = [],
    matrixIds = [];

    for (var z = 0; z <= 13; ++z) {
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = epsgCode + ':' + z;
    }

    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                title: 'Norges grunnkart',
                source: new ol.source.WMTS({
                    url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=XpLRMwelrHFF0ZLB1h8m',
                    layer: 'norges_grunnkart_graatone',
                    matrixSet: epsgCode,
                    format: 'image/png',
                    projection: projection,
                    tileGrid: new ol.tilegrid.WMTS({
                        origin: ol.extent.getTopLeft(projection.getExtent()),
                        resolutions: resolutions,
                        matrixIds: matrixIds
                    }),
                    attributions: [new ol.Attribution({
                        html: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                    })]
                })
            })
        ],
        view: new ol.View({
            projection: projection,
            center: [262985, 6651604],
            zoom: 11,
            minZoom: 8,
            maxZoom: 13
        })
    });
      
      }
  // This example creates a simple polygon representing the Bermuda Triangle.

 
}

