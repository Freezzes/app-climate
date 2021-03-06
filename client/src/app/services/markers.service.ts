import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { Map } from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  capitals: string = '../../assets/station_input.geojson';
  
  constructor(private http: HttpClient) { }
  makeCapitalMarkers(map: L.Map): void {
    this.http.get(this.capitals).subscribe((res: any) => {
      for (const c of res.features) {
        const lat = c.geometry.coordinates[0];
        const lon = c.geometry.coordinates[1];
        const latlng = L.latLng(lat, lon)
        // const marker = L.marker(latlng).addTo(map);
        // console.log(latlng)
      }
    });
  }  
}
