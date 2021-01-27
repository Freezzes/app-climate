import { Component, OnInit, OnChanges, Input} from '@angular/core';
import 'ol/ol.css';
import * as MapLib from './lib/map.js';
import { NC_csv ,st } from '../interfaces/temp.interface'
import { TempService } from 'src/app/services/temp.service';
// import { timestamp } from 'rxjs/operators';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-netcdf',
    templateUrl: './netcdf.component.html',
    styleUrls: ['./netcdf.component.css'],
    providers:[TempService]
})
export class NetcdfComponent implements OnInit {
  @Input() data: string;
  @Input() file: string;
  @Input() startyear: string;
  @Input() stopyear: string;
  @Input() startmonth: string;
  @Input() stopmonth: string;

    hoveredDate: NgbDate | null = null;

    map: any;
    datalayer : any;
    public dataset;
    public input_ds;
    public lenght_y;
    public verb;
    public years;

    constructor(private tempService: TempService) {
    }

    choosefile = new FormGroup({
      file: new FormControl('', Validators.required)
    });

    async ngOnInit() {
      this.map = MapLib.draw_map('map')
      MapLib.add_graticule_layer(this.map)

      let dataset = ''
          if(String(this.file) == String('Temperature mean')){
            this.input_ds = 'Average temperature '
            dataset = 'mean'
          }
          if(String(this.file) == String('Temperature min')){
            this.input_ds = 'Average minimum temperature'
            dataset = 'min'
          }
          if(String(this.file) == String('Temperature max')){
            dataset = 'max'
            this.input_ds = 'Average maximum temperature'
          }
          if(String(this.file) == String('Preciptipation')){
            this.input_ds = 'Average preciptipation'
            dataset = 'pre'
          }
          if(String(this.file) == String('HadEX2')){
            this.input_ds = 'Average preciptipation'
            dataset = 'hadex2'
          }
          console.log("key",dataset)

        this.plotmap(this.map,dataset)
  }
  async plotmap(map,Indataset){
    console.log("Plot Map Work")
    console.log(Indataset)
    console.time()

      let v
      let L = []
      // this.lenght_y = ((this.stopyear - this.startyear)+1) + String("year")
      this.years = String("(")+this.startyear+String("-")+this.stopyear+String(")")
      console.timeLog()
      

      MapLib.select_country(this.map)
      MapLib.clearLayers(this.map);
      await this.tempService.get_Avgcsv(Indataset,this.startyear,this.stopyear,
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
          MapLib.clearLayers(map);
          this.map.addLayer(this.datalayer)    
          MapLib.select_country(map)
          // MapLib.select_c(this.map)
          console.log("finish")
          console.timeEnd()
         
        } 
    )))
  }

}