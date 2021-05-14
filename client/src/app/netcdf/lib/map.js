import 'ol/ol.css';
import * as ol from 'openlayers';

import * as d3 from 'C:/Users/Mewkk/app-climate/client/src/assets/d3/d3.js';
import * as $ from 'jquery'

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
      // minszoom: 1.7,
      // maxZoom: 12,
      // zoom: 2.6,
      minZoom: 2.6,
      // extent: [20, -10, 180, 85], 
      zoom: 2.6,
      center: [100, 38]
    })

  });

  return map
}
//-----------------------Select Country----------------------------------
export function select_country(targetMap, unit) {
  var features, baselayer;

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

  targetMap.getLayers().forEach(function (layers) {
    console.log("name layer", layers.get('name'))
    if (layers.get('name') === 'lowres_data') {
      features = layers.getSource().getFeatures()
      console.log("1111",features)
      console.log("leng",features.length)
      if (layers.get('name') === 'hires_data') {
        console.log("select high")
        features = layers.getSource().getFeatures()
      }
    } else if (layers.get('name') === 'baseLayer') {
      baselayer = layers
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
          console.log("3")
          console.log("******", features[i].getProperties().value)
          valueArr.push(features[i].getProperties().value);
          // valueArr.push(obj.value)
        }
      }
      console.log("value",valueArr)
      var min = Math.round(Math.min.apply(null, valueArr) * 100) / 100;
      var max = Math.round(Math.max.apply(null, valueArr) * 100) / 100;
      var avg = Math.round(valueArr.reduce((a, b) => a + b, 0) / valueArr.length * 100) / 100
      var sum = Math.round(valueArr.reduce((a, b) => a + b, 0))

      $("#selectedCountryMin").text(min);
      $("#selectedCountryMax").text(max);
      $("#selectedCountryAvg").text(avg);
      $("#selectedCountrySum").text(sum);
    }
    else if  (e.selected.length == 0){
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

export function select_country_h(targetMap, unit) {
  var features, baselayer;
  targetMap.getLayers().forEach(function (layers) {
    console.log("name layer", layers.get('name'))
    if (layers.get('name') === 'hires_data') {
      features = layers.getSource().getFeatures()
      // if(layers.get('name') === 'lowres_data'){
      //   features = layers.getSource().getFeatures()
      // }
    } else if (layers.get('name') === 'baseLayer') {
      baselayer = layers
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
          // valueArr.push(obj.value)
        }
      }
      console.log("value",valueArr)
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
      color: 'rgba(0,88,212,0.25)',
      width: 0.5,
    }),
  });
  minor_gratucule.setMap(target);

  const major_graticule = new ol.Graticule({
    maxLines: 100,
    intervals: [20, 20],
    targetSize: 40,
    // lonLabelPosition	: 0,
    // lonLabelStyle: new Text({
    //   font: '20px Calibri,sans-serif',
    //   // textBaseline: 'bottom',
    //   fill: new Fill({
    //     color: 'rgba(0,0,0,1)'
    //   }),
    //   stroke: new Stroke({
    //     color: 'rgba(255,255,255,1)',
    //     width: 3
    //   })
    // }),
    strokeStyle: new ol.style.Stroke({
      color: 'rgba(0,88,212,1)',
      width: 0.5,
    }),
    showLabels: false
  });
  major_graticule.setMap(target);
}

//-------------------------Gen grid-----------------------------
export function genGridData(geojson, min, max, color_map,unit, lon_step, lat_step, type, layername = '',name,long_name) {
  var colors = []; var colorScale; var title; var tickformat;

  console.log("color",color_map)
  if (color_map == 'cool_warm') {
    colors = ['#bd1726', '#d42d27', '#e34933', '#f16640', '#f7844e', '#fca55d', '#fdbf71', '#fed687', '#fee99d', '#fff7b3', '#f7fcce', '#e9f6e8', '#d6eef5', '#bde2ee', '#a3d3e6', '#87bdd9', '#6ea6ce', '#588cc0', '#4471b2', '#3a54a4'].reverse()
    if (type == 'main') {
      // title = 'tempurature (°C)'
      colorScale = d3.scaleQuantile([min, 0, max], colors)
    } else if (type == 'per') {
      title = 'tempurature (%)'
      colorScale = d3.scaleQuantile([min, 0, max], colors)
    }
  }else if (color_map=='warm_cool') {
    colors = ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"]  //d3.schemeRdYlBu[11]
    if(type == 'main'){
      // title = 'tempurature (°C)'
      colorScale = d3.scaleQuantile([min, max], colors)
    }else if (type == 'per') {
      title = 'tempurature (%)'
      colorScale = d3.scaleQuantile([min, 0, max], colors)
    }
  }
  else if (color_map == 'dry_wet') {
    colors = ['#8c510a', '#9e5c0b', '#bf812d', '#d49a4b', '#dfc27d', '#eedfba', '#fcf4e1','#f5f5f5', '#d6eef5', '#bde2ee', '#a3d3e6', '#87bdd9', '#6ea6ce', '#588cc0', '#4471b2', '#3a54a4']
    if (type == 'main'){
      // title = 'precipitation (mm)'
      // colors = ['#8c510a', '#9e5c0b', '#bf812d', '#d49a4b', '#dfc27d', '#eedfba', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#2b7a74', '#01665e', '#005040', '#003c30', '#002820']
      // colors = ['#6e4007', '#a16518', '#ca9849', '#e7cf94', '#f6ecd1', '#f5f2e8', '#edf2f5', '#dbeaf2', '#c5dfec', '#a7d0e4', '#87beda', '#5fa5cd', '#3f8ec0', '#2f79b5', '#1f63a8', '#124984']
      // colors = ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"]
      colorScale = d3.scaleQuantile([0,max], colors)
    } else if (type == 'per'){
      title = 'precipitation (%)'
      colorScale = d3.scaleQuantile([min, 0, max], colors)
    }
  }
  else if (color_map=='wet_dry') {

    colors = ['#714108', '#8d520b', '#a96c1e', '#c28633', '#d3aa5f', '#e2c787', '#efdcad', '#f6ebcd', '#f5f2e8'].reverse()
    if(type == 'main'){
      // color = ['#714108', '#8d520b', '#a96c1e', '#c28633', '#d3aa5f', '#e2c787', '#efdcad', '#f6ebcd', '#f5f2e8'].reverse()
      colorScale = d3.scaleQuantile([0, max], colors)
    } else if(type == 'per'){
      title = 'precipitation (%)'
      // color = ["#a6611a", "#dfc27d", "#f5f5f5", "#80cdc1", "#018571"].reverse()
      colorScale = d3.scaleQuantile([min, 0, max], colors)
    }
  } 
  // tickformat = ".2f"
  // if(name == 'map1' || name == 'map2'){ tickformat = ".0f"}
  var title = long_name
  legend({
    color: colorScale,
    title: title+" "+unit,
    tickFormat: ".2f",
    target: name
  })

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
    // extent: [-180, -90, 180, 90],
    features: (new ol.format.GeoJSON()).readFeatures(geojson)
  });

  var gridLayer = new ol.layer.Vector({
    name: layername,
    source: grid,
    style: gridStyle
  });
  // map.addLayer(gridLayer);
  console.log("grid",gridLayer)

  return gridLayer
}

// ------------------------legend--------------------------------

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

//--------------------------Convert Data------------------------------
export function convert_to_geojson(data, lon, lat) {
  // console.log("lonnnnnnnnnnnnnnn",lon)
  console.log("234",data.length)
  var geojsondata = {
    type: 'FeatureCollection',
    features: []
  };
  for (var i = 0; i < data.length; i++) {
    geojsondata.features.push({
      type: 'Feature',
      properties: { "value": data[i]},
      geometry: {
        type: 'Point',
        coordinates: [lon[i], lat[i]]
      }
    })
  }
  console.log("geo",geojsondata)
  console.log('Create Geojson Done')
  return geojsondata
}

export function merge_data_to_geojson(geojsondata, data, North, South, West, East) {
  var temp = data
  console.log("ffff",temp)
  console.log("RR",North,South,West,East)
  console.log(geojsondata.features.length)
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

  console.log("merge", geojsondata)

  return geojsondata
}

export function merge_datatrend_to_geojson(geojsondata, data, North, South, West, East, type) {

  var data = data
  var trend = "";

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

//-------------------------Clear Layers----------------------------
export function clearLayers(map) {
  const layers = map.getLayers().getArray()
  console.log("layer re", layers)
  var layersToRemove = [];
  map.getLayers().forEach(function (layer) {
    if (layer.get('name') == 'lowres_data' || layer.get('name') == 'hires_data') {
      layersToRemove.push(layer);
      console.log("layer :", layersToRemove)
    }
  });

  for (var i = 0; i < layersToRemove.length; i++) {
    console.log(">>>>>> Clear <<<<<<<")
    map.removeLayer(layersToRemove[i]);
  }
  console.log("length layerRemove2", layersToRemove.length)
}

export function setResolution(map,North,South,West,East) {
  function onMoveEnd(evt) {
    var map = evt.map;
    var extent = map.getView().calculateExtent(map.getSize());
    console.log("Extent", extent)
    map.getLayers().forEach(function (layer) {
      if (layer.get('name') == 'lowres_data') {
        console.log("<<<<<<<Low>>>>>>>>>>")
        layer.set('minZoom', 2)
        layer.set('maxZoom', 6)
        // layer.set('extent', [0, -90, 180, 90])
        if (extent[0] - extent[2] > -100) {
          console.log(">150")
          layer.set('extent', [0, 0, 0, 0])
        }
        else if (extent[0] - extent[2] < -100) {
          layer.set('extent', [extent[0], extent[1], extent[2], extent[3]])
        }
      }
      else if (layer.get('name') == 'hires_data') {
        console.log("<<<<<<<Hight>>>>>>>>>>")
        layer.set('minZoom', 6)
        layer.set('maxZoom', 12)
        if (extent[0] - extent[2] > -100) {
          console.log(">100")
          layer.set('extent', [extent[0], extent[1], extent[2], extent[3]])
        } else if (extent[0] - extent[2] < -100) {
          layer.set('extent', [0, 0, 0, 0])
        }
      }
    })
  }

  map.on('moveend', onMoveEnd);
}

export function setzoom(map) {
  var extent = map.getView().calculateExtent(map.getSize());
  console.log("EXENT", extent)
  map.getLayers().forEach(function (layer) {
    console.log("<<<<<<<SET>>>>>>>>>>")
    // layer.set('minZoom', 0.001)
    // layer.set('zoom',0.001)
    // layer.set('maxZoom', 4)
    // map.getView().setZoom(1);
  });
}

export function setzoom_center(map, North, South, West, East) {
  var extent = map.getView().calculateExtent(map.getSize());
  console.log("EXENT", extent)
  console.log("Regionnnnn", North, South, West, East)
  if (North == 85 && South == -10 && West == 20 && East == 180) {
    console.log("Asiaaaaaaaa")
    map.getView().setZoom(2.6)
    map.getView().setCenter(ol.proj.transform([100, 38], 'EPSG:4326', 'EPSG:3857'))
    // map.zoomToExtent(new ol.Bounds(West, South, East, North))
    // map.getLayers().forEach(function (layer) {
    //   console.log("<<<<<<<SET>>>>>>>>>>")
    //   // layer.set('center', [0, 0])
    //   // layer.set('zoom', 0.1)
    // });
  }
  // if (North == 90 && South == -90 && West == -180 && East == 180) {
  //   console.log("Wolddd")
  //   map.getView().setZoom(1)
  //   map.getView().setCenter(ol.proj.transform([0, 0], 'EPSG:4326', 'EPSG:3857'))
  //   map.zoomToExtent(new ol.Bounds(West, South, East, North))
  //   // map.getLayers().forEach(function (layer) {
  //   //   console.log("<<<<<<<SET>>>>>>>>>>")
  //   //   // layer.set('center', [0, 0])
  //   //   // layer.set('zoom', 0.1)
  //   // });
  // }
  // else if (North == 85 && South == -10 && West == 20 && East == 180) {
  //   console.log("Asiaaaaaaaa")
  //   map.getView().setZoom(2.6)
  //   map.getView().setCenter(ol.proj.transform([100, 38], 'EPSG:4326', 'EPSG:3857'))
  //   // map.zoomToExtent(new ol.Bounds(West, South, East, North))
  //   // map.getLayers().forEach(function (layer) {
  //   //   console.log("<<<<<<<SET>>>>>>>>>>")
  //   //   // layer.set('center', [0, 0])
  //   //   // layer.set('zoom', 0.1)
  //   // });
  // }

}


