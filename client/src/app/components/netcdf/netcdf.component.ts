import { Component, OnInit } from '@angular/core';
import * as ol from 'openlayers';
import WMTS from 'ol/source/WMTS';

import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {get as getProjection} from 'ol/proj';
import {getTopLeft, getWidth} from 'ol/extent';
import * as d3 from "d3";
import * as MapLib from './lib/map.js';
import {Fill, Stroke, Style, Text} from 'ol/style.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import Graticule from 'ol/layer/Graticule';

@Component({
    selector: 'app-netcdf',
    templateUrl: './netcdf.component.html',
    styleUrls: ['./netcdf.component.css']
})
export class NetcdfComponent implements OnInit {

    map = MapLib

    constructor() { }

    ngOnInit(): void {
        this.map.draw_map('map');
        
        
        // var gridSize = 100,  
        //     epsgCode = 'EPSG:4326', // UTM 33N
        //     projection = ol.proj.get(epsgCode),
        //     projectionExtent = projection.getExtent(),
        //     size = ol.extent.getWidth(projectionExtent) / 256,
        //     resolutions = [],
        //     matrixIds = [];

        // for (var z = 0; z <= 13; ++z) {
        //     resolutions[z] = size / Math.pow(2, z);
        //     matrixIds[z] = epsgCode + ':' + z;
        // }

        // var style = new Style({
        //     fill: new Fill({
        //       color: 'rgba(255, 255, 255, 0.6)'
        //     }),
        //     stroke: new Stroke({
        //       color: '#319FD3',
        //       width: 1
        //     }),
        //     text: new Text({
        //       font: '12px Calibri,sans-serif',
        //       fill: new Fill({
        //         color: '#000'
        //       }),
        //       stroke: new Stroke({
        //         color: '#fff',
        //         width: 3
        //       })
        //     })
        //   });

//------------------------map----------------------------------------------------------
        // var vectorSource = new ol.source.Vector({
        //     // url: 'https://openlayers.org/en/v4.6.5/examples/data/geojson/countries.geojson',
        //     url:'./assets/map/geo-medium.json',
        //       format: new ol.format.GeoJSON()
        //     });

        // var mapvectorLayer = new ol.layer.Vector({
        //     source: new ol.source.Vector({
        //     url: './assets/map/geo-medium.json',
        //     format: new ol.format.GeoJSON(),
        // }),
        
        // // style: function(feature) {
        // //    return style;
        // //     }
        // });
        
        
        // const map = new ol.Map({
        //     layers: [
        //     new ol.layer.Tile({
        //         source: new ol.source.OSM()
        //     }),
        //     mapvectorLayer
        //     ],
        //     target: 'map',
        //     view: new ol.View({
        //         projection: 'EPSG:4326',
        //         center: [0, 0],
        //         zoom: 2,
        //         minZoom:2,
        //         maxZoom:10
        //     })
        // });

//----------------------polygon----------------------------------------
        // var polygonStyle = [
        //     new Style({
        //     stroke: new Stroke({
        //         color: 'blue',
        //         width: 3
        //     }),
        //     fill: new Fill({
        //         color: 'rgba(0, 0, 255, 0.1)'
        //     })
        //     })
        // ]

        // var geojsonObject = {
        //     'type': 'FeatureCollection',
        //     'crs': {
        //     'type': 'name',
        //     'properties': {
        //         'name': 'EPSG:3857'
        //     }
        //     },
        //     'features': [{
        //     'type': 'Feature',
        //     'geometry': {
        //         'type': 'Polygon',
        //         'coordinates': [[[0, 6e6], [-5e6, 8e6], [-3e6, 8e6],
        //         [-3e6, 6e6], [0, 6e6]]]
        //     }
        //     }]
        // }

        // var geoJsonsource = new VectorSource({
        //     features: (new GeoJSON()).readFeatures(geojsonObject)
        // });

        // var geoLayer = new VectorLayer({
        //     source: geoJsonsource,
        //     style: polygonStyle
        // });

        // // var geojsonObject = {
        // //     type: 'FeatureCollection',
        // //     features : [
        // //         {
        // //             type: 'Feature',
        // //             geometry:{
        // //                 type: 'Point',
        // //                 coordinates: [0,0]
        // //             },
        // //             properties: {
        // //                 value : 20
        // //             },
        // //         },
        // //     ]
        // // }

        // var colorScale = d3.scale.threshold()
        //     .domain([20, 50, 100, 200, 300, 400, 500]) 
        //     .range(['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026']);

        // var geojsonFeature = { 
        //     'type': 'FeatureCollection',
        //     'features': [{
        //         'type': 'Feature',
        //         'geometry': { 
        //             'type': 'Point',
        //             'coordinates': [0,0]
        //             },
        //             'properties': {
        //                 'value': 0
        //             },
        //         },
        //         {
        //         'type': 'Feature',
        //         'geometry': {
        //             'type': 'Point',
        //             'coordinates': [0,2.5]
        //             },
        //             'properties': {
        //                 'value': 10
        //             },
        //         },
        //         {
        //         'type': 'Feature',
        //         'geometry': {
        //             'type': 'Point',
        //             'coordinates': [2.5,0]
        //             },
        //             'properties': {
        //                 'value': 20
        //             },
        //         },
        //         {
        //         'type': 'Feature',
        //         'geometry': {
        //             'type': 'Point',
        //             'coordinates': [2.5,2.5]
        //             },
        //             'properties': {
        //                 'value': -10
        //             },
        //         }]
        //     }
                
        // var grid = new ol.source.Vector({
        //     features: (new ol.format.GeoJSON()).readFeatures(geojsonFeature),
        //     attributions: [new ol.Attribution({
        //     html: '<a href="http://ssb.no/">SSB</a>'
        //     })]
        // });
        
        // var gridStyle = function (feature) {
        //     // console.log(feature)
        //     var coordinate = feature.getGeometry().getCoordinates(),
        //         x = coordinate[0] - gridSize / 2,
        //         y = coordinate[1] - gridSize / 2,
        //         pop = parseInt(feature.getProperties().sum)
        //         console.log(coordinate)
        //         // rgb = d3.rgb(colorScale(pop));
    
        //     return [
        //         new ol.style.Style({
        //             fill: new ol.style.Fill({
        //                 // color: [rgb.r, rgb.g, rgb.b, 0.6]
        //             }),
        //             geometry: new ol.geom.Polygon([[
        //                 [x,y], [x, y + gridSize], [x + gridSize, y + gridSize], [x + gridSize, y]
        //             ]])
        //         })
        //     ];
        // };

  //------------------------------------------------------------------------------------------------------------------------      
        // const minor_gratucule = new Graticule({
        //     // the style to use for the lines, optional.
        //     maxLines: 200,
        //     intervals: [2.5, 2.5],
        //     targetSize: 20,
        //     strokeStyle: new Stroke({
        //         color: 'rgba(0,88,212,0.3)',
        //         width: 1,
        //     }),
        //     });
        //     minor_gratucule.setMap(map);
            
        // const major_graticule = new Graticule({
        //     maxLines: 100,
        //     intervals: [20, 20],
        //     targetSize: 40,
        //     strokeStyle: new Stroke({
        //         color: 'rgba(0,88,212,0.3)',
        //         width: 1,
        //     }),
        //     showLabels: true
        //     });
        //     major_graticule.setMap(map);


        // var gridLayer = new ol.layer.Vector({
        //     source: grid,
        //     style: gridStyle            
        // }); 
        // console.log(gridLayer);
        // map.addLayer(gridLayer);
        
    }

}

