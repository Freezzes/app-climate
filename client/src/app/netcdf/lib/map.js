import 'ol/ol.css';
import * as ol from 'openlayers';

import * as d3 from 'C:/Users/ice/Documents/climate/data/d3/d3';;
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
      // zoom:10,
      // minZoom: 2,
      // maxZoom: 12  
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
      // center: [0, 0],
      // zoom: 1.7,
      // minZoom: 1.7,
      // // maxZoom:12,
      // extent: [-180, -90, 180, 90]
      zoom: 2.6,
      minZoom: 1.7,
      center: [100, 38]
    })
  });

  // function onMoveEnd(evt) {
  //   console.log("workkkkkkkkk")
  //   var map = evt.map;
  //   var extent = map.getView().calculateExtent(map.getSize());
  //   console.log("extent",extent)
  // }

  // map.on('moveend', onMoveEnd);

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
  // var features ;
  // targetMap.getLayers().forEach(function(layers) {
  //   if (layers.get('name') === 'dataLayer') {
  //     features = layers.getSource().getFeatures()
  //     // console.log(layers.getSource().getFeatures());
  //   }
  // })


  targetMap.addInteraction(select);

  select.on('select', function (e) {
    if (e.selected.length != 0) {
      var selectedCountry = e.selected[0];
      var poly = e.selected[0].getGeometry()
      console.log("geometry", poly)
      // console.log(poly.a())
      console.log("select", selectedCountry)
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
          // var obj = features[i].getProperties()
          // valueArr.push(obj.value)
        }
      }
      console.log(valueArr)
      var min = Math.round(Math.min.apply(null, valueArr) * 100) / 100;
      var max = Math.round(Math.max.apply(null, valueArr) * 100) / 100;
      var avg = Math.round(valueArr.reduce((a, b) => a + b, 0) / valueArr.length * 100) / 100
      var sum = Math.round(valueArr.reduce((a, b) => a + b, 0))

      $("#selectedCountryMin").text(min);
      $("#selectedCountryMax").text(max);
      $("#selectedCountryAvg").text(avg);
      $("#selectedCountrySum").text(sum);
    }
  })

  return select
}

//-------------------------grid-----------------------------------------------------------------------
export function add_graticule_layer(target) {
  const minor_gratucule = new ol.Graticule({
    // the style to use for the lines, optional.
    maxLines: 200,
    intervals: [5, 5],
    targetSize: 40,
    strokeStyle: new ol.style.Stroke({
      color: 'rgba(0,88,212,1)',
      width: 0.5,
    }),
    showLabels: false
  });
  minor_gratucule.setMap(target);

  const major_graticule = new ol.Graticule({
    maxLines: 100,
    intervals: [20, 20],
    targetSize: 40,
    strokeStyle: new ol.style.Stroke({
      color: 'rgba(0,88,212,1)',
      width: 0.5,
    }),
    showLabels: false
  });
  major_graticule.setMap(target);

}

//-------------------------Gen grid-----------------------------
export function genGridData(geojson, min, max, color_map, lon_step, lat_step, type, layername = '',name) {

  var colors = [];
  var colorScale;
  var title; var tickformat;
  if (color_map == 'cool_warm') {
    if (type == 'main') {
      title = 'temperature (°C)'
      colors = ['#bd1726', '#d42d27', '#e34933', '#f16640', '#f7844e', '#fca55d', '#fdbf71', '#fed687', '#fee99d', '#fff7b3', '#f7fcce', '#e9f6e8', '#d6eef5', '#bde2ee', '#a3d3e6', '#87bdd9', '#6ea6ce', '#588cc0', '#4471b2', '#3a54a4'].reverse()
      colorScale = d3.scaleQuantile([min, 0, max], colors)
    } else if (type == 'per') {
      title = 'temperature (%)'
      colors = ['#bd1726', '#d42d27', '#e34933', '#f16640', '#f7844e', '#fca55d', '#fdbf71', '#fed687', '#fee99d', '#fff7b3', '#f7fcce', '#e9f6e8', '#d6eef5', '#bde2ee', '#a3d3e6', '#87bdd9', '#6ea6ce', '#588cc0', '#4471b2', '#3a54a4'].reverse()
      // colors = ['#bd1726', '#f16640',  '#fdbf71', '#fff7b3', '#d6eef5', '#87bdd9', '#3a54a4'].reverse()
      colorScale = d3.scaleQuantile([min, 0, max], colors)
    }
  }
  else if (color_map == 'dry_wet') {
    title = 'precipitation (mm)'
    colors = ['#8c510a', '#9e5c0b', '#bf812d', '#d49a4b', '#dfc27d', '#eedfba', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#2b7a74', '#01665e', '#005040', '#003c30', '#002820']
    // colors = ['#6e4007', '#a16518', '#ca9849', '#e7cf94', '#f6ecd1', '#f5f2e8', '#edf2f5', '#dbeaf2', '#c5dfec', '#a7d0e4', '#87beda', '#5fa5cd', '#3f8ec0', '#2f79b5', '#1f63a8', '#124984']
    // colors = ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"]
    colorScale = d3.scaleQuantile([0,max], colors)
    if(type == 'per'){ title = 'precipitation (%)'}
  }
  // tickformat = ".2f"
  // if(name == 'map1' || name == 'map2'){ tickformat = ".0f"}

  legend({
    color: colorScale,
    title: title,
    tickFormat: ".0f",
    target: name
  })

  var createTextStyle = function (feature) {
    return new ol.style.Text({
      textAlign: "center",
      text: feature.getProperties().trend,
      fill: new ol.style.Fill({ color: "black" }),
      stroke: new ol.style.Stroke({ color: "black", width: 1 }),
      placement: "point",
    });
  };

  var gridStyle = function (feature) {
    var coordinate = feature.getGeometry().getCoordinates(),
      x = coordinate[0] - lon_step / 2,
      y = coordinate[1] - lat_step / 2,

      pop = parseInt(feature.getProperties().value),
      rgb = d3.rgb(colorScale(pop));

    // console.log(x,y)
    if (isNaN(pop)) { return }
    return [
      new ol.style.Style({
        fill: new ol.style.Fill({
          color: [rgb.r, rgb.g, rgb.b, 0.9]
        }),
        stroke: new ol.style.Stroke({
          color: [0, 0, 0, 0.8],
          width: 0.1,
        }),
        geometry: new ol.geom.Polygon([[
          [x, y], [x, y + lat_step], [x + lon_step, y + lat_step], [x + lon_step, y], [x, y]
        ]]),
        // text: createTextStyle(feature)
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
  // map.addLayer(gridLayer);

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
  tickSize = 6,
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
  if (target == 'map1' || target == 'map2'){width = 450}
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

//---------------------------Legend-----------------------------
function createLegend(colorScale, min, max, color, type,name) {
  if (type == 'main') {
    var x = d3.scaleSequential()
      .domain([min, max], color)
      .range([0, 400])
      .nice();

    var xAxis = d3.axisBottom()
      .scale(x)
      .tickSize(20)
      .tickValues(colorScale.domain());


    var svg = d3.select('svg.' + name +'.legend');
    svg.selectAll('rect').remove();

    svg.selectAll('rect')
      .data(colorScale.range().map(function (color) {
        var d = colorScale.invertExtent(color);
        if (d[0] == null) d[0] = x.domain()[0];
        if (d[1] == null) d[1] = x.domain()[1];
        return d;
      }))
      .enter().append('rect')
      .attr('height', 16)
      .attr("x", function (d) { return x(d[0]); })
      .attr('width', function (d) { return x(d[1]) - x(d[0]) })
      // .attr('width',function(d) { 
      //   if (d[0] == x.domain()[0] && d[1] == x.domain()[1]) return 0
      //   else return x(d[1]) - x(d[0])
      // })

      .style('fill', function (d) { return colorScale(d[0]); });
    svg.selectAll("g").remove(); // remove all tick bar
    svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);
  }

  if (type == 'per') {
    var x = d3.scaleSequential()
      .domain([min, max], color)
      .range([0, 400])
      .nice();

    var xAxis = d3.axisBottom()
      .scale(x)
      .tickSize(20)
      .tickValues(colorScale.domain());

    var svg = d3.select('svg.' + name +'.legend');
    svg.selectAll('rect').remove();

    svg.selectAll('rect')
      .data(colorScale.range().map(function (color) {
        var d = colorScale.invertExtent(color);
        if (d[0] == null) d[0] = x.domain()[0];
        if (d[1] == null) d[1] = x.domain()[1];
        return d;
      }))
      .enter().append('rect')
      .attr('height', 16)
      .attr("x", function (d) { return x(d[0]); })
      .attr('width', function (d) { return x(d[1]) - x(d[0]) })
      // .attr('width',function(d) { 
      //   if (d[0] == x.domain()[0] && d[1] == x.domain()[1]) return 0
      //   else return x(d[1]) - x(d[0])
      // })

      .style('fill', function (d) { return colorScale(d[0]); });
    svg.selectAll("g").remove(); // remove all tick bar
    svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);
  }
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
  // var grids = geojsondata
  // console.log("temp",temp)
  for (let i = 0; i < geojsondata.features.length; i++) {
    // grids["features"][i]["properties"] = {"value": temp[i]}
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

  console.log("merge", geojsondata)

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
  console.log("geo", geojsondata)
  console.log('Create Geojson Done')
  return geojsondata
}

export function merge_data_to_geojson(geojsondata, data, North, South, West, East) {

  var temp = data
  console.log("merge", geojsondata)
  for (let i = 0; i < geojsondata.features.length; i++) {
    // grids["features"][i]["properties"] = {"value": temp[i]}
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
  // console.log(map.getLayers())
  // console.log(map.getView())
  // console.log("-----",West,East,North,South)
  map.getLayers().forEach(function (layer) {
    if (layer.get('name') == 'lowres_data') {
      console.log("<<<<<<<Low>>>>>>>>>>")
      layer.set('minZoom', 0.001)
      layer.set('zoom', 0.001)
      layer.set('maxZoom', 4)
      map.getView().setZoom(1);
      // layer.set('extent', [Number(West),Number(North),Number(East),Number(South)])
      // map.getView().setCenter([((Number(West) + Number(East))/2),((Number(North)+Number(South))/2)])
      // layer.set('extent', [West,North,East,South])
      // layer.set('center', [((Number(West) + Number(East))/2),((Number(North)+Number(South))/2)])
    }

  });
}
//-------------------------Clear Layers----------------------------
export function clearLayers(map) {
  var layersToRemove = [];
  map.getLayers().forEach(function (layer) {
    console.log("layerrrr", layer.get('name'))
    if (layer.get('name') == 'lowres_data' || layer.get('name') == 'hires_data' || layer.get('name') == 'trend') {
      layersToRemove.push(layer);
      console.log("layer :", layersToRemove)
    }
  });

  for (var i = 0; i < layersToRemove.length; i++) {
    console.log(">>>>>> Clear <<<<<<<")
    map.removeLayer(layersToRemove[i]);
  }
}


