import 'ol/ol.css';
import {Circle, Fill, Style} from 'ol/style';
import {Feature, Map, Overlay, View} from 'ol/index';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Point} from 'ol/geom';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {useGeographic} from 'ol/proj';
import * as $ from 'jquery'

useGeographic();

export function draw_map(){
    console.log("map")
    var place = [-110, 45];
    var point = new Point(place);

    const map = new Map({
        target: 'map_thai',
        view: new View({
            center: place,
            zoom: 8,
        }),
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
            new VectorLayer({
                source: new VectorSource({
                features: [new Feature(point)],
            }),
            style: new Style({
                image: new Circle({
                radius: 9,
                fill: new Fill({color: 'red'}),
                }),
            }),
        }) ],
    });
    console.log(map)
    return map
}

export function popup(){
    console.log("popup")
    var element = document.getElementById('popup');

    var popup = new Overlay({
        element: element,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -10],
    });
    console.log(popup)

    return popup
}

export function mapthai(){
    console.log("mapthai")
    var place = [120,20];

    var point = new Point(place);

    var map = new Map({
        target: 'map_thai',
        view: new View({
            center: place,
            zoom: 4,
        }),
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
            // new VectorLayer({
            //     source: new VectorSource({
            //         features: [new Feature(point)],
            // }),
            // style: new Style({
            //     image: new Circle({
            //     radius: 9,
            //     fill: new Fill({color: 'red'}),
            //     }),
            // }),
        // }) 
        ],
    });

    // var element = document.getElementById('popup');

    var popup = new Overlay({
        element: document.getElementById('popup'),
      });
    map.addOverlay(popup);
      
    var lists =  [[97.83333333, 19.3],[104.1333333,17.15]]
    for (var i = 0; i < lists.length; i++) {
        var element = document.createElement('marker');
        element.innerHTML = '<img src="https://cdn.mapmarker.io/api/v1/fa/stack?size=50&color=DC4C3F&icon=fa-microchip&hoffset=1" />';
        var marker = new Overlay({
            position: lists[i],
            positioning: 'center-center',
            element: element,
            stopEvent: false,
        });
        map.addOverlay(marker);
    }

    // var popup = new Overlay({
    //     element: element,
    //     positioning: 'bottom-center',
    //     stopEvent: false,
    //     offset: [0, -10],
    //     });
    // map.addOverlay(popup);

    function formatCoordinate(coordinate) {
        return ("\n    <table>\n      <tbody>\n        <tr><th>lon</th><td>" + (coordinate[0].toFixed(2)) + "</td></tr>\n        <tr><th>lat</th><td>" + (coordinate[1].toFixed(2)) + "</td></tr>\n      </tbody>\n    </table>");
    }

    var info = document.getElementById('info');
    map.on('moveend', function () {
        var view = map.getView();
        var center = view.getCenter();
        info.innerHTML = formatCoordinate(center);
    });

    map.on('click', function (evt) {
        var element = popup.getElement();
        var coordinate = evt.coordinate;
        // var hdms = toStringHDMS(toLonLat(coordinate));
      
        $(element).popover('dispose');
        popup.setPosition(coordinate);
        $(element).popover({
          container: element,
          placement: 'top',
          animation: false,
          html: true,
          content: formatCoordinate(coordinate),
        });
        $(element).popover('show');
      });
      
    // map.on('click', function (event) {
    //     var feature = map.getFeaturesAtPixel(event.pixel)[0];
    //     console.log("onclick", feature)
    //     if (feature) {
    //         var coordinate = feature.getGeometry().getCoordinates();
    //         popup.setPosition(coordinate);
    //         $(element).popover({
    //             container: element.parentElement,
    //             html: true,
    //             sanitize: false,
    //             content: formatCoordinate(coordinate),
    //             placement: 'top',
    //         });
    //         $(element).popover('show');
    //     } else {
    //         $(element).popover('dispose');
    //     }
    // });

    // map.on('pointermove', function (event) {
    // if (map.hasFeatureAtPixel(event.pixel)) {
    //     map.getViewport().style.cursor = 'pointer';
    // } else {
    //     map.getViewport().style.cursor = 'inherit';
    // }
    // });

    return map,popup,info

}