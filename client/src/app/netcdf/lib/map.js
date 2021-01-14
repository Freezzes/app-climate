import 'ol/ol.css';
import * as ol from 'openlayers';

import * as d3 from 'C:/Users/Mewkk/app-climate/client/src/assets/d3/d3.js';
import * as $ from 'jquery'
import Polygon from 'ol/geom/Polygon';
// var colors = {
//   'temp': ['#bd1726', '#e34933', '#f16640', '#f7844e', '#fca55d', '#fdbf71',  '#fee99d', '#fff7b3','#e9f6e8', '#d6eef5', '#bde2ee', '#87bdd9', '#6ea6ce', '#588cc0', '#4471b2','#15288a'].reverse(),
//   'pre' : ['#8c510a','#9e5c0b','#bf812d','#d49a4b','#dfc27d','#eedfba','#f6e8c3','#f5f5f5','#c7eae5','#80cdc1','#35978f','#2b7a74','#01665e','#005040','#003c30','#002820']
// }

// var population = 0,
// numberFormat = function (n) { // Thousand seperator
//   return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
// };

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

  // var selectedStyle = new ol.style.Style({
  //   stroke: new ol.style.Stroke({
  //     color: '#2196f3',
  //     width: 3
  //   })
  // });

  // var select = new ol.interaction.Select({
  //   style: selectedStyle
  // });

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
      zoom: 2,
      minZoom: 1.5,
      maxZoom:12,
      extent: [-180, -90, 180, 90]
    })
  });
  
  const a = map.getLayers().getArray()
  console.log("layer",map.getLayers())
  console.log("array",a)
  return map
}

// export function draw_poly(targetMap){
//   var draw = new ol.interaction.Draw({
//     // source: source,
//     type: Polygon
//   });
//   targetMap.addInteraction(draw)
// }
export function select_country(targetMap, mode) {
  // var features, baselayer ;
  // targetMap.getLayers().forEach(function(layers) {
  //   if (layers.get('name') === 'dataLayer') {
  //     features = layers.getSource().getFeatures()
  //   } else if (layers.get('name') === 'baseLayer') {
  //     baselayer = layers
  //   }
  // })

  var selectedStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#2196f3',
      width: 3
    })
  });

  var select = new ol.interaction.Select({
    // layers:[baselayer],
    style: selectedStyle
  });
  // console.log("select",select)
  targetMap.addInteraction(select);

  select.on('select', function(e) {
    var selectedCountry = e.selected[0];
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
    // for (var i = 0; i < features.length; i++) {
    //   if (poly.intersectsExtent(features[i].getGeometry().getExtent())) {
    //     var obj = features[i].getProperties()
    //     valueArr.push(obj.value)
    //   }
    // }
    // console.log(valueArr)
    // var min = Math.round(Math.min.apply(null, valueArr)*100)/100;
    // var max = Math.round(Math.max.apply(null, valueArr)*100)/100;

    // $("#selectedCountryMin").text(min);
    // $("#selectedCountryMax").text(max);
    // $("#selectedCountryMean").text(mean);
  });
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
            // text: createTextStyle(feature)
          })
        ];
    };
    
  var grid = new ol.source.Vector({
    wrapX: false,
    extent: [-180, -90, 180, 90],
    features: (new ol.format.GeoJSON()).readFeatures(geojson)
  });

  var gridLayer = new ol.layer.Vector({
    source: grid,
    style: gridStyle
  });
  gridLayer.set('name', 'data_layer')
  // map.addLayer(gridLayer);
  
  return gridLayer
}


// function showPopulation (population) {
//   d3.select('.info span').text(numberFormat(population));
// }

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
  
// export function gridselect (target, gridSize=1) {

//    // Create grid selection style
//   var gridSelectStyle = function (feature) {
//     var coordinate = feature.getGeometry().getCoordinates(),
//       x = coordinate[0]- gridSize / 2,
//       y = coordinate[1]- gridSize / 2,
//       pop = parseInt(feature.getProperties().value)
//       rgb = d3.rgb(colorScale(pop));
//       console.log("rgbselect",rgb)
//     return [
//       new ol.style.Style({
//         // stroke: new ol.style.Stroke({
//         //   color: '#333',
//         //   width: 1
//         // }),
//         fill: new ol.style.Fill({
//           color: [rgb.r, rgb.g, rgb.b, 0.6]
//         }),
//         geometry: new ol.geom.Polygon([[
//           [x,y], [x, y + gridSize], [x + gridSize, y + gridSize], [x + gridSize, y], [x,y]
//         ]])
//       })
//     ];
//   };

//   // Create grid select interaction
//   var gridSelect = new ol.interaction.Select({
//     style: gridSelectStyle
//   });
//   console.log("gridselect",gridSelect)
//   target.addInteraction(gridSelect);

//   var selectedGridCells = gridSelect.getFeatures();

//   selectedGridCells.on('add', function (feature) {
//     population += parseInt(feature.element.getProperties().sum);
//     showPopulation(population);
//   });

//   selectedGridCells.on('remove', function (feature) {
//     population -= parseInt(feature.element.getProperties().sum);
//     showPopulation(population);
//   });

//   var draw = new ol.interaction.Draw({
//     type: 'Polygon'
//   });

//   draw.on('drawstart', function (evt) {
//       selectedGridCells.clear();
//   });

//   draw.on('drawend', function (evt) {
//       var geometry = evt.feature.getGeometry(),
//           extent = geometry.getExtent(),
//           drawCoords = geometry.getCoordinates()[0];

//       map.removeInteraction(draw);
//       d3.select('.info .intro').style('display', 'block');
//       d3.select('.info .select').style('display', 'none');

//       grid.forEachFeatureIntersectingExtent(extent, function(feature) {
//           if (pointInPolygon(feature.getGeometry().getCoordinates(), drawCoords)) {
//               selectedGridCells.push(feature);
//           }
//       });

//       setTimeout(function(){ // Add delay to avoid deselect
//           gridSelect.setActive(true);
//       }, 500);
//   });

//   d3.select('.info a').on('click', function(){
//       d3.event.preventDefault();
//       selectedGridCells.clear();
//       gridSelect.setActive(false);
//       map.addInteraction(draw);
//       d3.select('.info .intro').style('display', 'none');
//       d3.select('.info .select').style('display', 'block');
//   });

//   return selectedGridCells
// }

// function draw_legend(gridSelect){
//   var selectedGridCells = gridSelect.getFeatures();

//   selectedGridCells.on('add', function (feature) {
//     population += parseInt(feature.element.getProperties().sum);
//     showPopulation(population);
//   });

//   selectedGridCells.on('remove', function (feature) {
//     population -= parseInt(feature.element.getProperties().sum);
//     showPopulation(population);
//   });
//   var draw = new ol.interaction.Draw({
//     type: 'Polygon'
//   });

//   draw.on('drawstart', function (evt) {
//       selectedGridCells.clear();
//   });

//   draw.on('drawend', function (evt) {
//       var geometry = evt.feature.getGeometry(),
//           extent = geometry.getExtent(),
//           drawCoords = geometry.getCoordinates()[0];

//       map.removeInteraction(draw);
//       d3.select('.info .intro').style('display', 'block');
//       d3.select('.info .select').style('display', 'none');

//       grid.forEachFeatureIntersectingExtent(extent, function(feature) {
//           if (pointInPolygon(feature.getGeometry().getCoordinates(), drawCoords)) {
//               selectedGridCells.push(feature);
//           }
//       });

//       setTimeout(function(){ // Add delay to avoid deselect
//           gridSelect.setActive(true);
//       }, 500);
//   });

//   d3.select('.info a').on('click', function(){
//       d3.event.preventDefault();
//       selectedGridCells.clear();
//       gridSelect.setActive(false);
//       map.addInteraction(draw);
//       d3.select('.info .intro').style('display', 'none');
//       d3.select('.info .select').style('display', 'block');
//   });
//   return draw
// }

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
  console.log('Create Geojson Done')
  return geojsondata
}
  
export function clearLayers(map){
  // console.log("old layer",map.getLayers())
  const layers = map.getLayers().getArray()

  for(var i=layers.length; i>=1; i--) {
    map.removeLayer(layers[i]);
    console.log(i,layers[i])
    console.log("last",layers)
  }
}
