import 'ol/ol.css';
import * as ol from 'openlayers';

export var station_id = '';

export function map_sta(loca){
    let testt = "test"
    console.log("test : ",testt)
    var test = loca[0]
    // console.log("sent",Object.values(test))
    var locations = [];
    for (i=0; i< loca.length; i++){
        locations.push(Object.values(loca[i]))
    }
    // console.log("lo",locations)

    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');
    
    
    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };
    
    
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
    for (var i = 0; i < locations.length; i++) {
        features.push(coloredSvgMarker([locations[i][2], locations[i][1]], locations[i][3], locations[i][0]));
    }
    // console.log("fea",features)
    
    var vectorSource = new ol.source.Vector({ // VectorSource({
        features: features
    });
    
    var vectorLayer = new ol.layer.Vector({ // VectorLayer({
        source: vectorSource
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
        station_id = _id;
        console.log("id",_id)
        if (names) {
            container.style.display = "block";
            var coordinate = evt.coordinate;
                content.innerHTML = names,_id;
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
    
    
    function coloredSvgMarker(lonLat, name,id) {
        // if (!color) color = 'red';
        // if (!circleFill) circleFill = 'white';
        // console.log("lonlat",lonLat)
        // console.log("name",name)
        // console.log("id",id)

        var feature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(lonLat)),
            names: name,
            _id:id
        });
        // var svg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve">' +
        //     '<path fill="' + color + '" d="M22.906,10.438c0,4.367-6.281,14.312-7.906,17.031c-1.719-2.75-7.906-12.665-7.906-17.031S10.634,2.531,15,2.531S22.906,6.071,22.906,10.438z"/>' +
        //     '<circle fill="' + circleFill + '" cx="15" cy="10.677" r="3.291"/></svg>';
    
        feature.setStyle(
            new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 4,
                    fill: new ol.style.Fill({color: 'red'}),
                }),
            })
        );
        return feature
    }
}

