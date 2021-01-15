import { Component, OnInit,OnChanges } from '@angular/core';
import 'ol/ol.css';
import * as MapLib from './lib/map.js';
import { NC_csv } from '../interfaces/temp.interface'
import { TempService } from 'src/app/services/temp.service';
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
    public features: []
    grid: any;
    map: any;
    datalayer : any;
    dataObj: any = null;
    selectgrid : any;
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
    public input_ds;
    public lenght_y;
    public verb;
    public years;
    select: any = null;

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

    async ngOnInit() {
      // this.map = MapLib.map_country('map')
      this.map = MapLib.draw_map('map')
      MapLib.add_graticule_layer(this.map)
      // MapLib.select_country(this.map)
      // MapLib.gridselect(this.map)
  }

    async plotmap(){
      console.time()
        // console.log(new Date())
      let fi = this.choosefile.value
      let dataset = ''
      for (let v of Object.values(fi)){
          if(String(v) == String('Temperature mean')){
            this.input_ds = 'Average temperature '
            dataset = 'mean'
          }
          if(String(v) == String('Temperature min')){
            this.input_ds = 'Average minimum temperature'
            dataset = 'min'
          }
          if(String(v) == String('Temperature max')){
            dataset = 'max'
            this.input_ds = 'Average maximum temperature'
          }
          if(String(v) == String('Preciptipation')){
            this.input_ds = 'Average preciptipation'
            dataset = 'pre'
          }
          console.log("key",dataset)
      }
      if(dataset != 'pre'){
        this.verb = "Averang"
      }
      else{
        this.verb = "sum"
      }
        this.dataset = dataset
        this.startyear = String(this.fromDate.year)
        this.startmonth = String(this.fromDate.month)
        this.stopyear = String(this.toDate.year)
        this.stopmonth = String(this.toDate.month)
        let v
        let L = []
        this.lenght_y = ((this.stopyear - this.startyear)+1) + String("year")
        this.years = String("(")+this.startyear+String("-")+this.stopyear+String(")")
        console.timeLog()

        // MapLib.select_country(this.map)
        // MapLib.clearLayers(this.map);
        await this.tempService.get_Avgcsv(this.dataset,this.startyear,this.stopyear,
                                              this.startmonth,this.stopmonth).then(data => data.subscribe(
          (res=> {      
            var val = res[1]
              for (v in val){
                data = val[v].values
                L.push(data)
              }
            const Max = Math.max.apply(null, L);
            const Min = Math.min.apply(null, L);
            console.log("Max", Max ,"Min",Min)

            const geojson = MapLib.convert_to_geojson(val);
            this.datalayer = MapLib.genGridData(geojson,Min,Max,res[0]);
            // this.selectgrid = MapLib.gridselect(geojson)
            MapLib.clearLayers(this.map);
            this.map.addLayer(this.datalayer)    
            MapLib.select_country(this.map)
            // MapLib.select_c(this.map)
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