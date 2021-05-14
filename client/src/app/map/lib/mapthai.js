import 'ol/ol.css';
import { Circle, Fill, Style } from 'ol/style';
import { Feature, Map, Overlay, View } from 'ol/index';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';
import * as ol from 'openlayers';
import * as $ from 'jquery'
import * as d3 from 'C:/Users/Mewkk/app-climate/client/src/assets/d3/d3.js';

useGeographic();

export function draw_map(target) {

  console.log("draw")

  var style = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0)'
    }),
    stroke: new ol.style.Stroke({
      color: '#242121',
      width: 0.5
    }),
  });

  var vectorLayer = new ol.layer.Vector({
    name: "baseLayer",
    source: new ol.source.Vector({
      url: './assets/thailand.json',
      // url: './assets/map/geo-medium.json',
      format: new ol.format.GeoJSON(),
    }),
    style: function (feature) {
      return style;
    }
  });

  const map = new ol.Map({
    target: target,
    layers: [
      vectorLayer
    ],
    view: new ol.View({
      projection: 'EPSG:4326',
      center: [100.523186, 13.736717],
      zoom: 5.5,
      minZoom: 5.5,
      maxZoom: 12,
    })

  });

  return map
}

export function genfearture(loca) {
  var locations = [];
  for (i = 0; i < loca[0].length; i++) {
    locations.push(Object.values(loca[0][i]))
  }
  console.log("lo", locations)

  var colors = [];
  var colorScale;

  var features = [];
  var value_ = []

  for (var i = 0; i < locations.length; i++) {
    if (locations[i][0] == null) {
      // console.log("null",locations[i][0])
    }
    else {
      features.push(coloredSvgMarker([locations[i][3], locations[i][2]], locations[i][4], locations[i][1], locations[i][0]));
      value_.push(locations[i][0])
    }
  }
  // console.log("fea",features)
  var max = Math.max.apply(null, value_);
  var min = Math.min.apply(null, value_);

  var color_map = loca[1]
  if (color_map == 'cool_warm') {
    colors = ['#bd1726', '#d42d27', '#e34933', '#f16640', '#f7844e', '#fca55d', '#fdbf71', '#fed687', '#fee99d', '#fff7b3', '#f7fcce', '#e9f6e8', '#d6eef5', '#bde2ee', '#a3d3e6', '#87bdd9', '#6ea6ce', '#588cc0', '#4471b2', '#3a54a4'].reverse()
    colorScale = d3.scaleQuantile([min, max], colors)
  } else if (color_map == 'dry_wet') {
    colors = ['#6e4007', '#894f0a', '#a16518', '#b97b29', '#ca9849', '#dbb972', '#e7cf94', '#f1e1b5', '#f6ecd1', '#f5f2e8', '#edf2f5', '#dbeaf2', '#c5dfec', '#a7d0e4', '#87beda', '#5fa5cd', '#3f8ec0', '#2f79b5', '#1f63a8', '#124984']
    colorScale = d3.scaleQuantile([min, max], colors)
  }

  var markstyle = function (feature) {
    console.log("000000000000")
    var LonLat = feature.getGeometry()
    console.log("LonLat", LonLat);
    var pop = feature.getProperties().value
    var rgb = d3.rgb(colorScale(pop));

    if (isNaN(pop)) { return }
    return [
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 4,
          fill: new ol.style.Fill({ color: [rgb.r, rgb.g, rgb.b, 1] }),
        }),
        geometry: new ol.geom.Point(ol.proj.fromLonLat([locations[i][3], locations[i][2]])),
      })
    ]
  }

  var vectorSource = new ol.source.Vector({ // VectorSource({
    extent: [10890756.8489042, 715797.913878592, 11695132.940209644, 2268457.471475674],
    // extent: [-180, -90, 180, 90],
    features: features
  });

  var vectorLayer = new ol.layer.Vector({
    name: 'datalayer',
    source: vectorSource,
    // style: markstyle
  });
  return vectorLayer
}

export function testlayer() {
  var layer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [
        new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([4.35247, 50.84673]))
        })
      ]
    })
  });

  return layer
}

function coloredSvgMarker(lonLat, name, id, val) {
  var feature = new ol.Feature({
    geometry: new ol.geom.Point(lonLat),
    names: name,
    _id: id,
    value: val
  });
  return feature;
}

export function clearLayers(map) {
  console.log("map", map.getLayers())
  console.log("old layer", map.getLayers().getArray())
  const layers = map.getLayers().getArray()
  var layersToRemove = [];
  map.getLayers().forEach(function (layer) {
    if (layer.get('name') == 'datalayer') {
      layersToRemove.push(layer);
      console.log("layer :", layersToRemove)
    }
  });
  for (var i = 0; i < layersToRemove.length; i++) {
    console.log(">>>>>> Clear <<<<<<<")
    map.removeLayer(layersToRemove[i]);
  }
}


export function icon(loca) {

  var locations = [];
  for (i = 0; i < loca[0].length; i++) {
    locations.push(Object.values(loca[0][i]))
  }
  console.log("lo", locations)

  var colors = [];
  var colorScale;
  var features = [];
  var value_ = []

  for (var i = 0; i < locations.length; i++) {
    if (locations[i][0] == null) {
      // console.log("null",locations[i][0])
    }
    else {
      features.push(coloredSvgMarker([locations[i][3], locations[i][2]], locations[i][4], locations[i][1], locations[i][0]));
      value_.push(locations[i][0])
    }
  }

  var max = Math.max.apply(null, value_);
  var min = Math.min.apply(null, value_);

  var color_map = loca[1]
  console.log("color", color_map)
  if (color_map == 'cool_warm') {
    colors = ['#bd1726', '#d42d27', '#e34933', '#f16640', '#f7844e', '#fca55d', '#fdbf71', '#fed687', '#fee99d', '#fff7b3', '#f7fcce', '#e9f6e8', '#d6eef5', '#bde2ee', '#a3d3e6', '#87bdd9', '#6ea6ce', '#588cc0', '#4471b2', '#3a54a4'].reverse()
    colorScale = d3.scaleQuantile([min, max], colors)
  } else if (color_map == 'dry_wet') {
    colors = ['#6e4007', '#894f0a', '#a16518', '#b97b29', '#ca9849', '#dbb972', '#e7cf94', '#f1e1b5', '#f6ecd1', '#f5f2e8', '#edf2f5', '#dbeaf2', '#c5dfec', '#a7d0e4', '#87beda', '#5fa5cd', '#3f8ec0', '#2f79b5', '#1f63a8', '#124984']
    colorScale = d3.scaleQuantile([min, max], colors)
  }

  var markstyle = function (feature) {
    var pop = feature.getProperties().value
    var rgb = d3.rgb(colorScale(pop));

    if (isNaN(pop)) { return }
    return [
      new ol.style.Style({
          image: new ol.style.Circle({
              radius: 4,
              fill: new ol.style.Fill({ color: [rgb.r, rgb.g, rgb.b, 1] }),
          }),
      })
    ]
  }

  var circle = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      fill: null,
      stroke: new ol.style.Stroke({
        color: 'rgba(255,0,0,0.9)',
        width: 3
      })
    })
  });

  var feature = new ol.Feature(
    new ol.geom.Point([100.523186, 13.736717])
  );

  var feature1 = new ol.Feature(
    new ol.geom.Point([101.523186, 13.736717])
  );
  console.log("1", feature1)
  console.log("2", features[0])
  var allfea = [feature, feature1]
  console.log("feas", features)
  // console.log("feap",features.getProperties().value)
  console.log("fea", feature)

  // feature.setStyle(circle);

  var vectorSource = new ol.source.Vector({
    features: features
  });

  // vectorSource.addFeature(feature);

  var vectorLayer = new ol.layer.Vector({
    name: 'datalayer',
    source: vectorSource,
    style: markstyle 
  });

  return vectorLayer
}

export function createMap() {
  var rasterLayer = new ol.layer.Tile({
    source: new ol.source.TileJSON({
      url: './assets/map/geo-medium.json',
      crossOrigin: ''
    })
  });

  var map = new ol.Map({
    layers: [rasterLayer],
    target: document.getElementById('map'),
    view: new ol.View({
      center: [100.523186, 13.736717],
      zoom: 3
    })
  });

  return map
}