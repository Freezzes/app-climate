import { Component, OnInit } from '@angular/core';
import 'ol/ol.css';
import * as MapLib from './lib/map.js';
import { NC } from '../../interfaces/temp.interface'
import { TempService } from 'src/app/services/temp.service';

@Component({
    selector: 'app-netcdf',
    templateUrl: './netcdf.component.html',
    styleUrls: ['./netcdf.component.css'],
    providers:[TempService]
})
export class NetcdfComponent implements OnInit {
    public geojsonObjects = [];
    public data:NC[];
    public features: []
    grid: any;
    map: any;

    constructor(private tempService: TempService) {}

    async ngOnInit() {
        this.tempService.getnc().subscribe(
            (res: NC[]) => {
                const geojson = MapLib.convert_to_geojson(res);
                console.log("geo",geojson)
                MapLib.draw_map('map',geojson);
            } 
        )
    }
}
