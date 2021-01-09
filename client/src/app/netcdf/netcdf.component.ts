import { Component, OnInit } from '@angular/core';
import 'ol/ol.css';
import * as MapLib from './lib/map.js';
import { NC_csv } from '../interfaces/temp.interface'
import { TempService } from 'src/app/services/temp.service';
// import { timestamp } from 'rxjs/operators';
import {FormGroup, FormControl,Validators} from '@angular/forms';
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
    public dataset;

    filename = [{id:'mean',name:'Temperature mean'},
               {id:'min',name:'Temperature min'},
               {id:'max',name:'Temperature max'},
               {id:'pre',name:'Preciptipation'}]
    
    constructor(private calendar: NgbCalendar, public formatter:NgbDateParserFormatter,private tempService: TempService) {
        this.fromDate = calendar.getToday();
        this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    }

    choosefile = new FormGroup({
      file: new FormControl('', Validators.required)
    });

    async ngOnInit() {this.map = MapLib.draw_map('map')}

    async plotmap(){
      console.time()
        // console.log(new Date())
      let fi = this.choosefile.value
      console.log(fi)
      let dataset = ''
      for (let v of Object.values(fi)){
          if(String(v) == String('Temperature mean')){
            dataset = 'mean'
          }
          if(String(v) == String('Temperature min')){
            dataset = 'min'
          }
          if(String(v) == String('Temperature max')){
            dataset = 'max'
          }
          if(String(v) == String('Preciptipation')){
            dataset = 'pre'
          }
          console.log("key",dataset)
      }
        this.dataset = dataset
        this.startyear = String(this.fromDate.year)
        this.startmonth = String(this.fromDate.month)
        this.stopyear = String(this.toDate.year)
        this.stopmonth = String(this.toDate.month)

        // this.map = MapLib.draw_map('map')
        console.timeLog()
        // MapLib.clearLayers(this.map);
        await this.tempService.get_testnc_csv(this.dataset,this.startyear,this.stopyear,this.startmonth,this.stopmonth).then(data => data.subscribe(
          (res=> {
            // this.map = MapLib.draw_map('map')
            const geojson = MapLib.convert_to_geojson(res);
            // console.log("geo",geojson)
            // MapLib.draw_map('map',geojson);
            this.datalayer = MapLib.genGridData(geojson);
            MapLib.clearLayers(this.map);
            this.map.addLayer(this.datalayer)
            // MapLib.clearLayers(this.map);
            
            console.log("finish")
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