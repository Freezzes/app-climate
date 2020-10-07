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

import * as d3 from 'C:/Users/Mewkkn/Downloads/d3/d3';

console.log("/map/lib/map.js work!")

var colorScale = d3.scaleThreshold()
    .domain([-20, -10, 0, 10, 20])
    .range(['#bd1726', '#f7844e', '#fff7b3', '#a3d3e6', '#3a54a4']);


export function draw_map(target) {

//-----------------------------------polygon-----------------------------------------------
    var polygonStyle = [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'blue',
          width: 3
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 0, 255, 0.1)'
        })
      })
    ]
    console.log(polygonStyle)
  
    var geojsonObject = {
      'type': 'FeatureCollection',
      'features': [
        { 'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates' : [0,0]
            // 'type': 'Polygon',
            // 'coordinates': [[[20, 0], [20, 2], [22, 2],
            // [22, 0], [20, 0]]]  
          },
          'properties': {
            'value': -20
          },
        },
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [0,2.5]
          },
          'properties': {
            'value': -10
          },
        },
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [2.5,0]
          },
          'properties': {
            'value': -10
          },
        },
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [2.5,2.5]
          },
          'properties': {
            'value': 10
          },
        },    
    ]
    }
  
    var polygonsource = new ol.source.Vector({
      wrapX: false,
      extent: [-180, -90, 180, 90],
      features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
    });
  
    var geoLayer = new ol.layer.Vector({
      source: polygonsource,
      style: polygonStyle
    });

//---------------------map-------------------------------------------------
  
    var style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.6)'
      }),
      stroke: new ol.style.Stroke({
        color: '#319FD3',
        width: 1
      }),
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
              vectorLayer//,geoLayer
              // mapvectorLayer,
            ],
            view: new ol.View({
              projection: 'EPSG:4326',
              center: [0, 0],
              zoom: 1.7,
              minZoom: 1.7,
              maxZoom:12,
            })
          });

    var datalayer = genGridData(geojsonObject);
        map.addLayer(datalayer);

//-------------------------grid-----------------------------------------------------------------------
    const minor_gratucule = new ol.Graticule({
          // the style to use for the lines, optional.
      maxLines: 200,
      intervals: [5, 5],
      targetSize: 40,
      strokeStyle: new ol.style.Stroke({
      color: 'rgba(0,88,212,0.25)',
      width: 0.5,
      }),
    });
    minor_gratucule.setMap(map);
      
    const major_graticule = new ol.Graticule({
          maxLines: 100,
          intervals: [20, 20],
          targetSize: 40,
          strokeStyle: new ol.style.Stroke({
            color: 'rgba(0,88,212,0.5)',
            width: 1,
          }),
          showLabels: true
    });
    major_graticule.setMap(map);

    return map
      
  }

  export function genGridData(geojson, gridSize=2.5) {
    // debugger;
    createLegend(colorScale);
    console.log('grid')
      //  
    var gridStyle = function (feature) {
      console.log('hi')
      var coordinate = feature.getGeometry().getCoordinates(),
        x = coordinate[0]- gridSize / 2,
        y = coordinate[1]- gridSize / 2,
        pop = parseInt(feature.getProperties().value),
        rgb = d3.rgb(colorScale(pop));
        console.log(x,y);
        if (isNaN(pop)) { return }
          return [
            new ol.style.Style({
              fill: new ol.style.Fill({
                color: [rgb.r, rgb.g, rgb.b, 0.6]
              }),
              geometry: new ol.geom.Polygon([[
               [x,y], [x, y + gridSize], [x + gridSize, y + gridSize], [x + gridSize, y], [x,y]
              ]])
            })
          ];
      };
      
    var grid = new ol.source.Vector({
      features: (new ol.format.GeoJSON()).readFeatures(geojson)
    });
      
    var gridLayer = new ol.layer.Vector({
      source: grid,
      style: gridStyle
    });
    
    return gridLayer
  }

  function createLegend (colorScale) {
      var x = d3.scaleLinear()
          .domain([-20, 20])
          .range([10, 330]);
  
      var xAxis = d3.axisBottom()
          .scale(x)
          .tickSize(14)
          .tickValues(colorScale.domain());
  
      var svg = d3.select('svg.legend');
  
      svg.selectAll('rect')
          .data(colorScale.range().map(function(color) {
              var d = colorScale.invertExtent(color);
              if (d[0] == null) d[0] = x.domain()[0];
              if (d[1] == null) d[1] = x.domain()[1];
              return d;
          }))
          .enter().append('rect')
          .attr('height', 10)
          .attr("x", function(d) { return x(d[0]); })
          .attr('width', function(d) { return x(d[1]) - x(d[0]); })
          .style('fill', function(d) { return colorScale(d[0]); });
  
      svg.call(xAxis);
  }