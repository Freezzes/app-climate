import 'ol/ol.css';
import * as ol from 'openlayers';

import * as d3 from '../../../assets/d3/d3';
import * as $ from 'jquery'
import Polygon from 'ol/geom/Polygon';
import { platformModifierKeyOnly } from 'ol/events/condition';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import { DragBox, Select } from 'ol/interaction';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { transformExtent } from 'ol/proj';
import { extend } from 'ol/extent';

function transform(extent) {
  return transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
}
export function draw_map(target) {

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
      url: './assets/map/geo-medium.json',
      format: new ol.format.GeoJSON(),
      wrapX: false,
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
      zoom: 2.6,
      minZoom: 1.7,
      center: [100, 38]
    })
  });

  return map
}

export function hightre(map) {
  function onMoveEnd(evt) {
    console.log("workkkkkkkkk")
    var map = evt.map;
    var extent = map.getView().calculateExtent(map.getSize());
    console.log("extent", extent)
    console.log(extent[0] - extent[2])
  }

  map.on('moveend', onMoveEnd);

}

//-----------------------Select Country----------------------------------
export function select_country(targetMap, mode) {

  var name = ''
  var value = ''
  var min = ''
  var max = ''
  var avg = ''
  var sum = '' 
  $("#selectedCountryName").text(name);
  $("#selectedCountryValue").text(value);
  $("#selectedCountryMin").text(min);
  $("#selectedCountryMax").text(max);
  $("#selectedCountryAvg").text(avg);
  $("#selectedCountrySum").text(sum);

  var features, baselayer;
  targetMap.getLayers().forEach(function (layers) {
    console.log("name layer", layers.get('name'))
    if (layers.get('name') === 'lowres_data') {
      features = layers.getSource().getFeatures()
      console.log("fea", features)
    } else if (layers.get('name') === 'datalayer') {
      features = layers.getSource().getFeatures()
    } else if (layers.get('name') === 'baseLayer') {
      baselayer = layers
      console.log("base", baselayer)
    }
  })

  var selectedStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#2196f3',
      width: 2
    })
  });

  var select = new ol.interaction.Select({
    layers: [baselayer],
    style: selectedStyle
  });

  targetMap.addInteraction(select);

  select.on('select', function (e) {
    if (e.selected.length != 0) {
      var selectedCountry = e.selected[0];
      var poly = e.selected[0].getGeometry()
      var valueArr = [];

      if (selectedCountry != undefined) {
        var name = selectedCountry.get('name');
        var value = selectedCountry.get('value')
        $("#selectedCountryName").text(name);
        $("#selectedCountryValue").text(value);
      }
      else {
        $("#selectedCountryName").text("None");
        $("#selectedCountryValue").text("-");
      }
      for (var i = 0; i < features.length; i++) {
        if (poly.intersectsExtent(features[i].getGeometry().getExtent())) {
          valueArr.push(features[i].getProperties().value);
        }
      }
      console.log("value country",valueArr)
      var min = Math.round(Math.min.apply(null, valueArr) * 100) / 100;
      var max = Math.round(Math.max.apply(null, valueArr) * 100) / 100;
      var avg = Math.round(valueArr.reduce((a, b) => a + b, 0) / valueArr.length * 100) / 100
      var sum = Math.round(valueArr.reduce((a, b) => a + b, 0))

      $("#selectedCountryMin").text(min);
      $("#selectedCountryMax").text(max);
      $("#selectedCountryAvg").text(avg);
      $("#selectedCountrySum").text(sum);
    }
    else if  (e.selected.length == 0) {
      $("#selectedCountryName").text('');
      $("#selectedCountryValue").text('');
      $("#selectedCountryMin").text('');
      $("#selectedCountryMax").text('');
      $("#selectedCountryAvg").text('');
      $("#selectedCountrySum").text('');
    }
  })

  return select
}

//-------------------------Gen grid-----------------------------
export function genGridData(geojson, min, max, color_map,unit, lon_step, lat_step, type, layername = '',name,long_name) {
  var colors = []; var colorScale; var title; var tickformat;

  console.log("color",color_map)
  if (color_map == 'cool_warm') {
    colors = ['#bd1726', '#e34933', '#f16640', '#f7844e', '#fca55d', '#fdbf71', '#fed687', '#f7fcce', '#e9f6e8', '#d6eef5', '#bde2ee', '#a3d3e6', '#6ea6ce', '#588cc0', '#3a54a4'].reverse()
    // colors = ['#bd1726', '#d42d27', '#e34933', '#f16640', '#f7844e', '#fca55d', '#fdbf71', '#fed687', '#fee99d', '#fff7b3', '#f7fcce', '#e9f6e8', '#d6eef5', '#bde2ee', '#a3d3e6', '#87bdd9', '#6ea6ce', '#588cc0', '#4471b2', '#3a54a4'].reverse()
    if (type == 'main') {
      colorScale = d3.scaleQuantile([min, max], colors)
    } else if (type == 'per') {
      colorScale = d3.scaleQuantile([min, 0, max], colors)
    }
  }else if (color_map=='warm_cool') {
    colors = ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"]  //d3.schemeRdYlBu[11]
    if(type == 'main'){
      colorScale = d3.scaleQuantile([min, max], colors)
    }else if (type == 'per') {
      colorScale = d3.scaleQuantile([min, 0, max], colors)
    }
  }
  else if (color_map == 'dry_wet') {
    colors = ['#8c510a', '#9e5c0b', '#bf812d', '#d49a4b', '#dfc27d', '#eedfba', '#f5f5f5', '#d6eef5', '#bde2ee', '#a3d3e6', '#87bdd9', '#6ea6ce', '#4471b2', '#3a54a4']
    if (type == 'main'){
      colorScale = d3.scaleQuantile([0,max], colors)
    } 
    else if (type == 'per'){
      title = 'precipitation (%)'
      colorScale = d3.scaleQuantile([min, 0, max], colors)
    }
  }
  else if (color_map=='wet_dry') {
    colors = ['#714108', '#8d520b', '#a96c1e', '#c28633', '#d3aa5f', '#e2c787', '#efdcad', '#f6ebcd', '#f5f2e8'].reverse()
    if(type == 'main'){
      colorScale = d3.scaleQuantile([0, max], colors)
    } 
    else if(type == 'per'){
      colorScale = d3.scaleQuantile([min, 0, max], colors)
    }
  } 

  if(type == 'per'){
    unit = '%'
  }

  var title = long_name
  legend({
    color: colorScale,
    title: title+" "+"("+unit+")",
    tickFormat: ".2f",
    target: name
  })

  var gridStyle = function (feature) {
    var coordinate = feature.getGeometry().getCoordinates(),
      x = coordinate[0] - lon_step / 2,
      y = coordinate[1] - lat_step / 2,

      pop = parseInt(feature.getProperties().value),
      rgb = d3.rgb(colorScale(pop));

    if (isNaN(pop)) { return }
    return [
      new ol.style.Style({
        fill: new ol.style.Fill({
          color: [rgb.r, rgb.g, rgb.b, 0.9]
        }),
        // stroke: new ol.style.Stroke({
        //   color: [255, 0, 255, 1],
        //   width: 0.0,
        // }),
        geometry: new ol.geom.Polygon([[
          [x, y], [x, y + lat_step], [x + lon_step, y + lat_step], [x + lon_step, y], [x, y]
        ]]),
      })
    ];
  };

  var grid = new ol.source.Vector({
    wrapX: false,
    extent: [-180, -90, 180, 90],
    features: (new ol.format.GeoJSON()).readFeatures(geojson)
  });
  console.log("grid", grid)
  var gridLayer = new ol.layer.Vector({
    name: layername,
    source: grid,
    style: gridStyle
  });

  return gridLayer
}

export function setResolution(map, North, South, West, East) {
  function onMoveEnd(evt) {
    var map = evt.map;
    var extent = map.getView().calculateExtent(map.getSize());
    map.getLayers().forEach(function (layer) {
      if (layer.get('name') == 'lowres_data') {
        console.log("<<<<<<<Low>>>>>>>>>>")
        layer.set('minZoom', 2)
        layer.set('maxZoom', 6)
        layer.set('extent', [0, -90, 180, 90])
        if (extent[0] - extent[2] > -150) {
          console.log(">150")
          layer.set('extent', [0, 0, 0, 0])
        }
        else if (extent[0] - extent[2] < -150) {
          layer.set('extent', [extent[0], extent[1], extent[2], extent[3]])
        }
      }
      else if (layer.get('name') == 'hires_data') {
        console.log("<<<<<<<Hight>>>>>>>>>>")
        layer.set('minZoom', 6)
        layer.set('maxZoom', 12)
        if (extent[0] - extent[2] > -150) {
          console.log(">100")
          layer.set('extent', [-180, -90, 180, 90])
        } else if (extent[0] - extent[2] < -150) {
          layer.set('extent', [0, 0, 0, 0])
        }
      }
    })
  }

  map.on('moveend', onMoveEnd);
}


// ------------------------ legend--------------------------------
function legend({
  color,
  title,
  tickSize = 8,
  width = 650, 
  height = 44 + tickSize,
  marginTop = 18,
  marginRight = 0,
  marginBottom = 16 + tickSize,
  marginLeft = 0,
  ticks = width / 64,
  tickFormat,
  tickValues,
  target
} = {}) {
  if (target == 'map1' || target == 'map2'){width = 550}
  let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);

  const thresholds
    = color.thresholds ? color.thresholds() // scaleQuantize
      : color.quantiles ? color.quantiles() // scaleQuantile
        : color.domain(); // scaleThreshold

  const thresholdFormat
    = tickFormat === undefined ? d => d
      : typeof tickFormat === "string" ? d3.format(tickFormat)
        : tickFormat;

  var x = d3.scaleLinear()
    .domain([-1, color.range().length - 1])
    .rangeRound([marginLeft, width - marginRight]);

    var svg = d3.select('svg.' + target + '.legend')
    svg.selectAll('rect').remove();
    svg.selectAll("g").remove();

    svg.append("g")
    .selectAll("rect")
    .data(color.range())
    .join("rect")
      .attr("x", (d, i) => x(i - 1))
      .attr("y", marginTop)
      .attr("width", (d, i) => x(i) - x(i - 1))
      .attr("height", height - marginTop - marginBottom)
      .attr("fill", d => d);

    tickValues = d3.range(thresholds.length);
    tickFormat = i => thresholdFormat(thresholds[i], i);

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x)
        .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
        .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
        .tickSize(tickSize)
        .tickValues(tickValues))
      .call(tickAdjust)
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
        .attr("x", marginLeft)
        .attr("y", marginTop + marginBottom - height - 6)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .attr("class", "title")
        .text(title));
  return svg.node();
}

// --------------------- trend --------------------------------------------
export function draw_trend(geojson, layername = '') {

  var createTextStyle = function (feature) {
    var texts = feature.getProperties().trend
    // console.log("text trend",texts)
    if (texts == '+') {
      return new ol.style.Text({
        textAlign: "center",
        text: feature.getProperties().trend,
        font: '12px',
        fill: new ol.style.Fill({ color: "black", width: 0.5 }),
        stroke: new ol.style.Stroke({ color: "red", width: 1 }),
        placement: "point",
      })
    }
    else if (texts == '-') {
      return new ol.style.Text({
        textAlign: "center",
        text: feature.getProperties().trend,
        font: '12px',
        fill: new ol.style.Fill({ color: "black", width: 0.5 }),
        stroke: new ol.style.Stroke({ color: "blue", width: 1 }),
        placement: "point",
      })
    }
  };

  var grid = new ol.source.Vector({
    wrapX: false,
    extent: [-180, -90, 180, 90],
    features: (new ol.format.GeoJSON()).readFeatures(geojson)
  });

  var gridLayer = new ol.layer.Vector({
    name: layername,
    source: grid,
    style: function (feature) {
      return new ol.style.Style({
        text: createTextStyle(feature)
      })
    }
  });

  return gridLayer
}

export function merge_datatrend_to_geojson(geojsondata, data, North, South, West, East, type) {

  var temp = data
  var trend = "";
  for (let i = 0; i < geojsondata.features.length; i++) {
    if (geojsondata['features'][i]['geometry']['coordinates'][0] >= West &&
      geojsondata['features'][i]['geometry']['coordinates'][0] <= East &&
      geojsondata['features'][i]['geometry']['coordinates'][1] >= South &&
      geojsondata['features'][i]['geometry']['coordinates'][1] <= North) {
      if (temp[i] == 0) { trend = "" }
      else if (temp[i] == 1) { trend = "+" }
      else if (temp[i] == -1) { trend = "-" }
      geojsondata["features"][i]["properties"] = { "trend": trend }
    }
  }

  // console.log("merge", geojsondata)
  return geojsondata
}

//--------------------------Convert Data------------------------------
export function convert_to_geojson(data, lon, lat) {
  var geojsondata = {
    type: 'FeatureCollection',
    features: []
  };
  for (var i = 0; i < data.length; i++) {
    geojsondata.features.push({
      type: 'Feature',
      properties: { "value": data[i] },
      geometry: {
        type: 'Point',
        coordinates: [lon[i], lat[i]]
      }
    })
  }
  return geojsondata
}

export function merge_data_to_geojson(geojsondata, data, North, South, West, East) {

  var temp = data
  for (let i = 0; i < geojsondata.features.length; i++) {
    if (geojsondata['features'][i]['geometry']['coordinates'][0] >= West &&
      geojsondata['features'][i]['geometry']['coordinates'][0] <= East &&
      geojsondata['features'][i]['geometry']['coordinates'][1] >= South &&
      geojsondata['features'][i]['geometry']['coordinates'][1] <= North) {
      geojsondata["features"][i]["properties"] = { "value": temp[i] }
    }
    else{
      geojsondata["features"][i]["properties"] = { "value": null }
    }
  }

  return geojsondata
}

export function setzoom(map) {
  map.getLayers().forEach(function (layer) {
    if (layer.get('name') == 'lowres_data') {
      console.log("<<<<<<<Low>>>>>>>>>>")
      layer.set('minZoom', 0.001)
      layer.set('zoom', 0.001)
      layer.set('maxZoom', 4)
      map.getView().setZoom(1);
    }

  });
}
//-------------------------Clear Layers----------------------------
export function clearLayers(map) {
  var layersToRemove = [];
  map.getLayers().forEach(function (layer) {
    if (layer.get('name') == 'lowres_data' || layer.get('name') == 'hires_data' || layer.get('name') == 'trend') {
      layersToRemove.push(layer);
    }
  });

  for (var i = 0; i < layersToRemove.length; i++) {
    map.removeLayer(layersToRemove[i]);
  }
}


