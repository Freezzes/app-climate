import { Component, OnInit } from '@angular/core';
import 'ol/ol.css';
import * as MapLib from './lib/map.js';
import { NC_csv } from '../interfaces/temp.interface'
import { TempService } from 'src/app/services/temp.service';
// import { timestamp } from 'rxjs/operators';
import {FormGroup, FormControl} from '@angular/forms';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-netcdf',
    templateUrl: './netcdf.component.html',
    styleUrls: ['./netcdf.component.css'],
    providers:[TempService]
})
export class NetcdfComponent implements OnInit {
    hoveredDate: NgbDate | null = null;

    fromDate: NgbDate;
    toDate: NgbDate | null = null;
    public geojsonObjects = [];
    // public data:NC[];
    public features: []
    grid: any;
    map: any;
    datalayer : any;
    public station;
    public startyear;
    public endyear;
    public startmonth;
    public endmonth;
    public startday;
    public endday;
    public stopyear;
    public stopmonth;
    
    constructor(private calendar: NgbCalendar, public formatter:NgbDateParserFormatter,private tempService: TempService) {
        this.fromDate = calendar.getToday();
        this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    }

    async ngOnInit() {}

    async plotmap(){
        console.log(new Date())
        console.time()
        this.startyear = String(this.fromDate.year)
        this.startmonth = String(this.fromDate.month)
        this.stopyear = String(this.toDate.year)
        this.stopmonth = String(this.toDate.month)
        // console.log("stopyear",this.stopyear)
        // await this.tempService.getnc().subscribe(
        //     (res: NC[]) => {
        //         const geojson = MapLib.convert_to_geojson(res);
        //         console.log("geo",geojson)
        //         MapLib.draw_map('map',geojson);
        //         console.log("finish",new Date())
        //     } 
        // )
        this.map = MapLib.draw_map('map')
        console.timeLog()
        // MapLib.clearLayers(this.map);
        await this.tempService.get_testnc_csv(this.startyear,this.stopyear,this.startmonth,this.stopmonth).then(data => data.subscribe(
          (res=> {
            // console.log(res)
            const geojson = MapLib.convert_to_geojson(res);
            // console.log("geo",geojson)
            // MapLib.draw_map('map',geojson);
            this.datalayer = MapLib.genGridData(geojson);
            // MapLib.clearLayers(this.map);
            // this.map.removeOverlay(this.datalayer)
            MapLib.clearLayers(this.map);
            this.map.addLayer(this.datalayer)
            
              console.log("finish",new Date())
              console.timeEnd()
          } 
      )))

    }
    onDateSelection(date: NgbDate) {
        if (!this.fromDate && !this.toDate) {
          this.fromDate = date;
        } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
          this.toDate = date;
        } else {
          this.toDate = null;
          this.fromDate = date;
        }
      }
    
      isHovered(date: NgbDate) {
        return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
      }
    
      isInside(date: NgbDate) {
        return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
      }
    
      isRange(date: NgbDate) {
        return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
      }

      validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
        const parsed = this.formatter.parse(input);
        return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
      }
}