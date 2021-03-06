import { Component, OnInit } from '@angular/core';
import { TempService } from '../services/temp.service';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import * as L from 'leaflet';
import { latLng, MapOptions, tileLayer, Map, Marker, icon } from 'leaflet';
import { MarkerService } from '../services/markers.service';

// const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  // iconRetinaUrl,
  iconUrl,
  // shadowUrl,
  iconSize: [18, 25],
  // iconAnchor: [12, 41],
  // popupAnchor: [1, -34],
  // tooltipAnchor: [16, -28],
  // shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [TempService, MarkerService]
})

export class MapComponent implements OnInit {

  map: Map;
  mapOptions: MapOptions;
  namesta = 'กรุงเทพ'

  constructor(
    private markerService: MarkerService,
    private http: HttpClient) {
  }

  capitals: string = '../../assets/station_input.geojson';

  ngOnInit() {
    this.initializeMapOptions();
    // this.addSampleMarker();
    // this.markerService.makeCapitalMarkers(this.map);
  }
  onMapReady(map: Map) {
    this.map = map;
    this.addSampleMarker();
    //this.markerdata();
  }

  private initializeMapOptions() {
    console.log("m")
    this.mapOptions = {
      center: latLng(20, 100),
      zoom: 4,
      layers: [
        L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=XpLRMwelrHFF0ZLB1h8m',{
            attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        })
      ],
    };
  }


  private addSampleMarker() {
    console.log("Mark")
    this.http.get(this.capitals).subscribe((res: any) => {
      for (const c of res.features) {
        const lat = c.geometry.coordinates[0];
        const lon = c.geometry.coordinates[1];
        const latlng = L.latLng(lon, lat)
        const mark = L.marker(latlng).addTo(this.map)
      }
    });
    console.log("k")
  }

}
