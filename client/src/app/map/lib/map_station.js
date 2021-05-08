import 'ol/ol.css';
import * as ol from 'openlayers';
import * as d3 from 'C:/Users/ice/Documents/climate/data/d3/d3';;
import { Router, ActivatedRoute } from '@angular/router';
import Overlay from 'ol/Overlay';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import OSM from 'ol/source/OSM';

export var station_id = '';
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
        center: [102.523186, 12.736717],
        position: ol.proj.fromLonLat([100, 10]),
        positioning: 'center-center',
        zoom: 6.0,
        minZoom: 6.0,
        maxZoom: 12,
        })

    });

    return map
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

export function add_data(loca) {
    var locations = [];
    for (i = 0; i < loca[0].length; i++) {
        locations.push(Object.values(loca[0][i]))
    }

    var colors = [];
    var colorScale;
    var features = [];
    var value_ = []
  
    for (var i = 0; i < locations.length; i++) {
      if (locations[i][0] != null) {
        // console.log("null",locations[i][0])
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
    var vectorSource = new ol.source.Vector({
        features: features
      });
    
    var vectorLayer = new ol.layer.Vector({
    name: 'datalayer',
    source: vectorSource,
    style: markstyle 
    });

    return vectorLayer
  
}

export function popup(map){
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

      /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    var overlay = new ol.Overlay({
        element: container,
        autoPan: false,
        // autoPanAnimation: {
        //     duration: 0
        // }
    });

     /**
     * Add a click handler to the map to render the popup.
     */
      map.on('singleclick', function(evt) {
        var names = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature.get('names');
        })
        console.log("name",names)
        var _id = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature.get('_id');
        })
        var value = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature.get('value');
        })
        station_id = _id;
        console.log("id",_id)
        if (names) {
            container.style.display = "block";
            var coordinate = evt.coordinate;
                content.innerHTML = names + "(" + _id + ")" + '<br/>' + value;
                overlay.setPosition(coordinate);
        } else if(_id){
            container.style.display = "block";
            var coordinate = evt.coordinate;
                content.innerHTML = _id;
                overlay.setPosition(coordinate);
        }
        else {
            container.style.display = "none";
        }
    });



    // map.on('pointermove', function (evt) {
    //     map.getTargetElement().style.cursor = map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
    //     var names = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    //         return feature.get('names');
    //     })
    //     console.log("name", names)
    //     var _id = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    //         return feature.get('_id');
    //     })

    //     var value = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    //         return feature.get('value');
    //     })
    //     console.log("id", _id)
    //     if (names) {
    //         container.style.display = "block";
    //         var coordinate = evt.coordinate;
    //         content.innerHTML = names + "(" + _id + ")" + '<br/>' + value;
    //         overlay.setPosition(coordinate);
    //     } else if (_id) {
    //         container.style.display = "block";
    //         var coordinate = evt.coordinate;
    //         content.innerHTML = _id;
    //         overlay.setPosition(coordinate);
    //     }
    //     else {
    //         container.style.display = "none";
    //     }
    // });
    map.addOverlay(overlay);
}

export function clearLayers(map){
    console.log("map",map.getLayers())
    console.log("old layer",map.getLayers().getArray())
    const layers = map.getLayers().getArray()
    var layersToRemove = [];
    map.getLayers().forEach(function(layer){
        if(layer.get('name') == 'datalayer' ){
            layersToRemove.push(layer);
            console.log("layer :", layersToRemove)
        }
    });
    for (var i = 0; i < layersToRemove.length; i++) {
        console.log(">>>>>> Clear <<<<<<<")
        map.removeLayer(layersToRemove[i]);
    }
}

export function map_sta(loca){
    var test = loca[0]
    console.log("map.js",test)
    var locations = [];
    for (i=0; i< loca[0].length; i++){
        locations.push(Object.values(loca[0][i]))
    }
    // console.log("lo",locations)

    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');
    
    var colors = []; 
    var colorScale;
    
    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };
    
    map.on('singleclick', function(evt) {
        var names = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature.get('names');
        })
        console.log("name",names)
        var _id = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature.get('_id');
        })
        var value = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature.get('value');
        })
        station_id = _id;
        console.log("id",_id)
        if (names) {
            container.style.display = "block";
            var coordinate = evt.coordinate;
                content.innerHTML = names + "(" + _id + ")" + '<br/>' + value;
                overlay.setPosition(coordinate);
        } else if(_id){
            container.style.display = "block";
            var coordinate = evt.coordinate;
                content.innerHTML = _id;
                overlay.setPosition(coordinate);
        }
        else {
            container.style.display = "none";
        }
    });
    
    
    /**
     * Create an overlay to anchor the popup to the map.
     */
    var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        // autoPanAnimation: {
        //     duration: 0
        // }
    });
    
    
    var features = [];
    var value_ = [];
    for (var i = 0; i < locations.length; i++) {
        if (locations[i][0] == null){
            console.log("null",locations[i][0])
        } 
        else{
            features.push(coloredSvgMarker([locations[i][3], locations[i][2]], locations[i][4], locations[i][1], locations[i][0]));
            value_.push(locations[i][0])
        }
    }
    // console.log("fea",features)
    var max = Math.max.apply(null, value_);
    var min = Math.min.apply(null, value_);

    var color_map = loca[1]
    console.log("color",color_map)
    if (color_map == 'cool_warm') {
        colors = ['#bd1726', '#d42d27', '#e34933', '#f16640', '#f7844e', '#fca55d', '#fdbf71', '#fed687', '#fee99d', '#fff7b3', '#f7fcce', '#e9f6e8', '#d6eef5', '#bde2ee', '#a3d3e6', '#87bdd9', '#6ea6ce', '#588cc0', '#4471b2', '#3a54a4'].reverse()
        colorScale = d3.scaleQuantile([min, max], colors)
    } else if (color_map == 'dry_wet') {
        colors = ['#6e4007', '#894f0a', '#a16518', '#b97b29', '#ca9849', '#dbb972', '#e7cf94', '#f1e1b5', '#f6ecd1', '#f5f2e8', '#edf2f5', '#dbeaf2', '#c5dfec', '#a7d0e4', '#87beda', '#5fa5cd', '#3f8ec0', '#2f79b5', '#1f63a8', '#124984']
        colorScale = d3.scaleQuantile([min, max], colors)
    }    

    var markstyle = function (feature) {
        var pop = feature.getProperties().value
        // console.log("pop",pop)
        var rgb = d3.rgb(colorScale(pop));

        if (isNaN(pop)) {return}
        return [
            new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 4,
                    fill: new ol.style.Fill({color:[rgb.r, rgb.g, rgb.b, 1]}),
                }),
            })
        ]
    }
    
    var vectorSource = new ol.source.Vector({ // VectorSource({
        features: features
    });
    
    var vectorLayer = new ol.layer.Vector({ // VectorLayer({
        source: vectorSource,
        style : markstyle
    });

    var vectorLayermap = new ol.layer.Vector({
        source: new ol.source.Vector({
          url: './assets/thailand.json',
          format: new ol.format.GeoJSON(),
        }),
    })
    
    var map = new ol.Map({
        layers: [
            vectorLayermap,
        //     new ol.layer.Tile({ // TileLayer({
        //         source: new ol.source.OSM(),
        //         format: new ol.format.GeoJSON({featureProjection: 'EPSG:3857'}),
        // }), 
            vectorLayer
        ],
        overlays: [overlay],
        target: 'map',
        view: new ol.View({
            center: [100.523186,13.736717],
            zoom: 5.5,
            minZoom: 5.5,
            maxZoom: 12,
            // extent: [-180, -90, 180, 90]
        })
    });
    
    // make the map's view to zoom and pan enough to display all the points
    map.getView().fit(vectorSource.getExtent(), map.getSize());
    
    /**
     * Add a click handler to the map to render the popup.
     */
    map.on('singleclick', function(evt) {
        var names = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature.get('names');
        })
        console.log("name",names)
        var _id = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature.get('_id');
        })
        var value = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature.get('value');
        })
        station_id = _id;
        console.log("id",_id)
        if (names) {
            container.style.display = "block";
            var coordinate = evt.coordinate;
                content.innerHTML = names + "(" + _id + ")" + '<br/>' + value;
                overlay.setPosition(coordinate);
        } else if(_id){
            container.style.display = "block";
            var coordinate = evt.coordinate;
                content.innerHTML = _id;
                overlay.setPosition(coordinate);
        }
        else {
            container.style.display = "none";
        }
    });
    map.on('pointermove', function(evt) {
        map.getTargetElement().style.cursor = map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
    });
    map.on('dblclick', function (evt) {
        var element = popup.getElement();
        var coordinate = evt.coordinate;
        var hdms = toStringHDMS(toLonLat(coordinate));

        // $(element).popover('dispose');
        // popup.setPosition(coordinate);
        $(element).popover({
          container: element,
          placement: 'top',
          animation: false,
          html: true,
          content: '<p>The location you clicked was:</p><code>' + hdms + '</code>',
        });
        $(element).popover('show');
      });

    // map.on('dblclick', function(evt) {
    //     var names = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
    //         return feature.get('names');
    //     })
    //     // this.ngZone.runOutsideAngular(() => {
    //     //   const feature = this.map.forEachFeatureAtPixel(evt.pixel, (feat, layer) => {
    //     //     // you can add a condition on layer to restrict the listener
    //     //     return feat;
    //     //   });
    
    
    function coloredSvgMarker(lonLat, name,id,val) {

        console.log("lonlat",lonLat)
        console.log("name",name)
        console.log("id",id)
        console.log("val",val) 
        var feature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(lonLat)),
            names: name,
            _id:id,
            value: val
        });

        return feature
    }
}

