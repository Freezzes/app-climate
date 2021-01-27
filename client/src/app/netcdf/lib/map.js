import 'ol/ol.css';
import * as ol from 'openlayers';

import * as d3 from 'C:/Users/ice/Documents/climate/data/d3/d3';;
import * as $ from 'jquery'
import Polygon from 'ol/geom/Polygon';
import {platformModifierKeyOnly} from 'ol/events/condition';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import {DragBox, Select} from 'ol/interaction';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';

export function draw_map(target) {
  
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
    name: "baseLayer",
    source: new ol.source.Vector({
      url: './assets/map/geo-medium.json',
      format: new ol.format.GeoJSON(),
      wrapX: false,
      // zoom:10,
      minZoom: 2,
      maxZoom: 12  
    }),
    style: function(feature) {
      return style;
    }
  });

  const  map = new ol.Map({
    target: target,
    layers: [
    //   new ol.layer.Tile({
    //     source: new ol.source.OSM()
    // }),
      vectorLayer
    ],
    view: new ol.View({
      projection: 'EPSG:4326',
      center: [0, 0],
      zoom: 1.7,
      minZoom: 1.7,
      maxZoom:12,
      extent: [-180, -90, 180, 90]
    })
  });
  
  const a = map.getLayers().getArray()
  console.log("layer",map.getLayers())
  console.log("array",a)
  return map
}

//-----------------------Select Country----------------------------------
export function select_country(targetMap, mode) {
  var features, baselayer ;
  targetMap.getLayers().forEach(function(layers) {
    if (layers.get('name') === 'dataLayer') {
      features = layers.getSource().getFeatures()
      console.log("fea",features)
    } else if (layers.get('name') === 'baseLayer') {
      baselayer = layers
      console.log("base",baselayer)
    }
  })

  var selectedStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#2196f3',
      width: 2
    })
  });

  var select = new ol.interaction.Select({
    layers:[baselayer],
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

  select.on('select', function(e) {
    var selectedCountry = e.selected[0];
    var poly = e.selected[0].getGeometry()
    var valueArr = [];

    if (selectedCountry != undefined){
      var name = selectedCountry.get('name');
      var value = selectedCountry.get('value')
      $("#selectedCountryName").text(name);
      $("#selectedCountryValue").text(value);
    }
    else{
      $("#selectedCountryName").text("None");
      $("#selectedCountryValue").text("-");
    }
    for (var i = 0; i < features.length; i++) {
      if (poly.intersectsExtent(features[i].getGeometry().getExtent())) {
        var obj = features[i].getProperties()
        valueArr.push(obj.value)
      }
    }
    console.log(valueArr)
    var min = Math.round(Math.min.apply(null, valueArr)*100)/100;
    var max = Math.round(Math.max.apply(null, valueArr)*100)/100;
    // var mean = Math.round(Math.mean.apply(null, valueArr));

    $("#selectedCountryMin").text(min);
    $("#selectedCountryMax").text(max);
    // $("#selectedCountryMean").text(mean);
  });

  //---------Box-----------------------------------------
  var dragBox = new DragBox({
    condition: platformModifierKeyOnly,
  });
  
  // targetMap.addInteraction(dragBox);
  
  // dragBox.on('boxend', function () {
  //   var rotation = map.getView().getRotation();
  //   var oblique = rotation % (Math.PI / 2) !== 0;
  //   var candidateFeatures = oblique ? [] : selectedFeatures;
  //   var extent = dragBox.getGeometry().getExtent();
  //   vectorSource.forEachFeatureIntersectingExtent(extent, function (feature) {
  //     candidateFeatures.push(feature);
  //   });
  
  //   if (oblique) {
  //     var anchor = [0, 0];
  //     var geometry = dragBox.getGeometry().clone();
  //     geometry.rotate(-rotation, anchor);
  //     var extent$1 = geometry.getExtent();
  //     candidateFeatures.forEach(function (feature) {
  //       var geometry = feature.getGeometry().clone();
  //       geometry.rotate(-rotation, anchor);
  //       if (geometry.intersectsExtent(extent$1)) {
  //         selectedFeatures.push(feature);
  //       }
  //     });
  //   }
  // });
  
  // // clear selection when drawing a new box and when clicking on the map
  // dragBox.on('boxstart', function () {
  //   selectedFeatures.clear();
  // });
  
  // var infoBox = document.getElementById('info');

  // var selectedFeatures = select.getFeatures();
  // selectedFeatures.on(['add', 'remove'], function () {
  //   var names = selectedFeatures.getArray().map(function (feature) {
  //     return feature.get('name');
  //   });
  //   if (names.length > 0) {
  //     infoBox.innerHTML = names.join(', ');
  //   } else {
  //     infoBox.innerHTML = 'No countries selected';
  //   }
  // });
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
    strokeStyle: new ol.style.Stroke({
      color: 'rgba(0,88,212,0.5)',
      width: 1,
    }),
    showLabels: true
  });
  major_graticule.setMap(target);

}

//-------------------------Gen grid-----------------------------
export function genGridData(geojson, min, max, color_map,  lat_step=1, lon_step=1,) {

  var colors = []
  console.log("geojson",geojson)
  console.log("min",min)
  console.log("max",max)
  console.log("color", color_map)
  if (color_map == 'cool_warm') {
    colors = ['#bd1726', '#d42d27', '#e34933', '#f16640', '#f7844e', '#fca55d', '#fdbf71', '#fed687', '#fee99d', '#fff7b3', '#f7fcce', '#e9f6e8', '#d6eef5', '#bde2ee', '#a3d3e6', '#87bdd9', '#6ea6ce', '#588cc0', '#4471b2', '#3a54a4'].reverse()
  } else if (color_map == 'dry_wet') {
    colors = ['#6e4007', '#894f0a', '#a16518', '#b97b29', '#ca9849', '#dbb972', '#e7cf94', '#f1e1b5', '#f6ecd1', '#f5f2e8', '#edf2f5', '#dbeaf2', '#c5dfec', '#a7d0e4', '#87beda', '#5fa5cd', '#3f8ec0', '#2f79b5', '#1f63a8', '#124984']
  }
  
  var colorScale = d3.scaleThreshold()
    .domain(d3.range(min, max, (Math.abs(min)+Math.abs(max)) / (colors.length-1)))
    .range(colors);
  
  createLegend(colorScale, min, max);

  var createTextStyle = function (feature) {
    return new ol.style.Text({
      textAlign: "center",
      text: feature.getProperties().trend,
      fill: new ol.style.Fill({color: "black"}),
      stroke: new ol.style.Stroke({color: "black", width: 1}),
      placement: "point",
    });
  };

  var gridStyle = function (feature) {
    var coordinate = feature.getGeometry().getCoordinates(),
      x = coordinate[0]- lon_step / 2,
      y = coordinate[1]- lat_step / 2,

      pop = parseInt(feature.getProperties().value),
      rgb = d3.rgb(colorScale(pop));
 
      // console.log(x,y)
      if (isNaN(pop)) { return }
        return [
          new ol.style.Style({
            fill: new ol.style.Fill({
              color: [rgb.r, rgb.g, rgb.b, 0.8]
            }),
            // stroke: new ol.style.Stroke({
            //   color: [0, 0, 0, 0.8],
            //   width: 0.2,
            // }),    
            geometry: new ol.geom.Polygon([[
              [x,y], [x, y + lat_step], [x + lon_step, y + lat_step], [x + lon_step, y], [x,y]
            ]]),
            text: createTextStyle(feature)
          })
        ];
    };
    
  var grid = new ol.source.Vector({
    wrapX: false,
    extent: [-180, -90, 180, 90],
    features: (new ol.format.GeoJSON()).readFeatures(geojson)
  });

  var gridLayer = new ol.layer.Vector({
    name: "dataLayer",
    source: grid,
    style: gridStyle
  });
  // map.addLayer(gridLayer);
  
  return gridLayer
}

//---------------------------Legend-----------------------------
function createLegend (colorScale,min,max) {
  var x = d3.scaleLinear()
  .domain([min, max])
  .range([0, 500])
  .nice();

  var xAxis = d3.axisBottom()
    .scale(x)
    .tickSize(20)
    .tickValues(colorScale.domain());

  var svg = d3.select('svg.legend');
  svg.selectAll('rect').remove();

  svg.selectAll('rect')
    .data(colorScale.range().map(function(color) {
        var d = colorScale.invertExtent(color);
        if (d[0] == null) d[0] = x.domain()[0];
        if (d[1] == null) d[1] = x.domain()[1];
        return d;
    }))
    .enter().append('rect')
    .attr('height', 16)
    .attr("x", function(d) { return x(d[0]); })
    .attr('width', function(d) {return x(d[1]) - x(d[0])})
    // .attr('width',function(d) { 
    //   if (d[0] == x.domain()[0] && d[1] == x.domain()[1]) return 0
    //   else return x(d[1]) - x(d[0])
    // })
    
    .style('fill', function(d) { return colorScale(d[0]); });
  svg.selectAll("g").remove(); // remove all tick bar
  svg.append("g")
    .attr("class", "x axis")
    .call(xAxis);

}

//--------------------------Convert Data------------------------------
export function convert_to_geojson(data){
  var geojsondata = {
        type: 'FeatureCollection',
        features: []
  };
  for (var i =0; i< data.length ;i++) {
    geojsondata.features.push({
          type: 'Feature',
          properties: { "value": data[i].values},
          geometry: {
              type: 'Point',
              coordinates: [data[i].lon, data[i].lat]
          }
        })
  }
  console.log("geo",geojsondata)
  console.log('Create Geojson Done')
  return geojsondata
}
  
//-------------------------Clear Layers----------------------------
export function clearLayers(map){
  // console.log("old layer",map.getLayers())
  const layers = map.getLayers().getArray()

  for(var i=layers.length; i>=1; i--) {
    map.removeLayer(layers[i]);
    console.log(i,layers[i])
    console.log("last",layers)
  }
}