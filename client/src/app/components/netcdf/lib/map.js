import 'ol/ol.css';
import * as ol from 'openlayers';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Graticule from 'ol/layer/Graticule';
import Polygon from 'ol/geom/Polygon'

// GeoJson
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import {Fill, Stroke, Style, Text} from 'ol/style.js';
// import { Mapinter } from './interfaces/temp.interfaces.ts'

import * as d3 from 'd3';

console.log("/map/lib/map.js work!")

// var colorScale = d3.scaleThreshold()
//   .domain([-20, -10, 0, 10, 20])
//   .range(['#bd1726', '#f7844e', '#fff7b3', '#a3d3e6', '#3a54a4']);

export function draw_map(target) {

    console.log("good")

    //     'type'; 'FeatureCollection',
    // 'features'; [{
    //     'type': 'Feature',
    //     'geometry': { 
    //         'type': 'Point',
    //         'coordinates': [0,0]
    //         },
    //         'properties': {
    //             'value': 0
    //         },
    //     },
    //     {
    //     'type': 'Feature',
    //     'geometry': {
    //         'type': 'Point',
    //         'coordinates': [0,2.5]
    //         },
    //         'properties': {
    //             'value': 10
    //         },
    //     },
    //     {
    //     'type': 'Feature',
    //     'geometry': {
    //         'type': 'Point',
    //         'coordinates': [2.5,0]
    //         },
    //         'properties': {
    //             'value': 20
    //         },
    //     },
    //     {
    //     'type': 'Feature',
    //     'geometry': {
    //         'type': 'Point',
    //         'coordinates': [2.5,2.5]
    //         },
    //         'properties': {
    //             'value': -10
    //         },
    //     }]
    var polygonStyle = [
      new Style({
        stroke: new Stroke({
          color: 'blue',
          width: 3
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)'
        })
      })
    ]
  
    var geojsonObject = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:3857'
        }
      },
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [[[0, 6e6], [-5e6, 8e6], [-3e6, 8e6],
            [-3e6, 6e6], [0, 6e6]]]
        }
      }]
    }
    console.log(geojsonObject)
  
    var geoJsonsource = new ol.source.Vector({
      features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
    });
  
    var geoLayer = new ol.layer.Vector({
      source: geoJsonsource,
      style: polygonStyle
    });
  
    var raster = new ol.layer.Tile({
      source: new ol.source.OSM()
    });
  
    var style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.6)'
      }),
      stroke: new ol.style.Stroke({
        color: '#319FD3',
        width: 1
      }),
      text: new ol.style.Text({
        font: '12px Calibri,sans-serif',
        fill: new ol.style.Fill({
          color: '#000'
        }),
        stroke: new ol.style.Stroke({
          color: '#fff',
          width: 3
        })
      })
    });
  
    var vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        url: './assets/map/geo-medium.json',
        format: new ol.format.GeoJSON(),
        wrapX: false,
        zoom:4,
        minZoom: 4,
        maxZoom: 10  
      }),
      style: function(feature) {
        // display country name
        // style.getText().setText(feature.get('name'));
        return style;
      }
    });
  

    const  map = new ol.Map({
            target: target,
            layers: [
              new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
              vectorLayer
              // mapvectorLayer,
            ],
            view: new ol.View({
              projection: 'EPSG:4326',
              center: [0, 0],
              zoom: 2.1,
              minZoom: 2.1,
              maxZoom:12,
            })
          });
    
    // console.log(map)

    // const minor_gratucule = new Graticule({
    //         // the style to use for the lines, optional.
    //   maxLines: 200,
    //   intervals: [2.5, 2.5],
    //   targetSize: 20,
    //   strokeStyle: new Stroke({
    //   color: 'rgba(0,88,212,0.3)',
    //   width: 1,
    //   }),
    // });
    // minor_gratucule.setMap(map);
        
    // const major_graticule = new Graticule({
    //       maxLines: 100,
    //       intervals: [20, 20],
    //       targetSize: 40,
    //       strokeStyle: new Stroke({
    //       color: 'rgba(0,88,212,0.3)',
    //       width: 1,
    //       }),
    //       showLabels: true
    //       });
    //     major_graticule.setMap(map);
    //   console.log(map)
      return map
      
    }
        

        
        
        
        

 