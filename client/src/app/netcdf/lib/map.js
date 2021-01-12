import 'ol/ol.css';
import * as ol from 'openlayers';

import * as d3 from 'C:/Users/ice/Documents/climate/data/d3/d3';

console.log("/map/lib/map.js work!")

var colorScale = d3.scaleThreshold()
    .domain([-20,-15, -10,-5, 0,5, 10,15, 20,25,30])
    .range(['#15288a', '#3a54a4', '#a3d3e6','#a5f6fa','#fff7b3','#ffd633','#f7b64e','#f7a04e','#f7844e','#fc3b05', '#bd1726' ]);

export function draw_map(target) {
  // clearLayers(map)
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
      zoom:1,
      minZoom: 1,
      maxZoom: 6  
    }),
    style: function(feature) {
      // display country name
      // style.getText().setText(feature.get('name'));
      return style;
    }
  });

  var selectedStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#2196f3',
      width: 3
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.6)'
    })
  });

  var select = new ol.interaction.Select({
    style: selectedStyle
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
      zoom: 1.5,
      minZoom: 1.5,
      maxZoom:12,
      extent: [-180, -90, 180, 90]
    })
  });

    // var datalayer = genGridData(geojsonObject);
    // console.log('data',datalayer)
    // map.removeLayer(datalayer);
    // map.addLayer(datalayer);

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

  select.on('select', function(e) {
    var selectedCountry = e.selected[0];
    if (selectedCountry != undefined){
      var name = selectedCountry.get('name');
      var abbr = selectedCountry.get('iso_a3')
      $("#selectedCountryName").text(name);
    }
    else{
      $("#selectedCountryName").text("None");
    }
  });  
  const a = map.getLayers().getArray()
  console.log("layer",map.getLayers())
  console.log("array",a)
  // console.log("array0",a[0])
  // console.log("array1",a[1])
  // console.log("array2",a[2])
  return map
}

export function genGridData(geojson,  lat_step=1, lon_step=1) {
  createLegend(colorScale);
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
              color: [rgb.r, rgb.g, rgb.b, 0.6]
            }),
            geometry: new ol.geom.Polygon([[
              [x,y], [x, y + lat_step], [x + lon_step, y + lat_step], [x + lon_step, y], [x,y]
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
  

export function convert_to_geojson(data){
  var geojsondata = {
        type: 'FeatureCollection',
        features: []
  };
  // console.log("data",data[0])
  for (var i =0; i< data.length ;i++) {
  //   let value = data[i].values;
    
  //   if (String(value) == String("9.969") ){
  //     value = null
  //  }
  
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
  const layers = map.getLayers().getArray()
  console.log("Clayer",layers)
  console.log(layers.length)
  for(var i=layers.length; i>=2; i--) {
    map.removeLayer(layers[i]);
    console.log(i,layers[i])
    // console.log("g")
  }
  console.log("c",map.getLayers().getArray());
  // layers.length = ;
  // console.log("clear work")
}
