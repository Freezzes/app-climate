import { Component, OnInit, OnChanges, Input} from '@angular/core';
import 'ol/ol.css';
import * as MapLib from './lib/map.js';
import { NC_csv ,st } from '../interfaces/temp.interface'
import { TempService } from 'src/app/services/temp.service';
import { FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable, range } from 'rxjs';
import { geojson } from 'highcharts';
import { data } from 'jquery';
// import { RecieveDataService } from 'src/app/home/data.service';

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
  @Input() start_date: string;
  @Input() stop_date: string
  @Input() stopyear: string;
  @Input() startmonth: string;
  @Input() stopmonth: string;
  @Input() per: string;
  @Input() North: number;
  @Input() South: number;
  @Input() West: number;
  @Input() East: number;

  hoveredDate: NgbDate | null = null;

    map: any;
    map1: any;
    map2: any;
    datalayer : any;
    datalayer1: any;
    datalayer2: any;
    public index;
    public input_ds;
    public lenght_y;
    public verb;
    public years;
    type;
    percent;
    selectyear;
    range_y;
    value_db;
    Max;
    Min;
    color;
    grid;
    lat_step;
    lon_step;

    start1;
    stop1
    start2;
    stop2;
    monthsel ;
    public monthselect = [];

    value1;
    value2;
    min1;
    max1;
    plot1 = '';
    plot2 = '';

    lowres_layer: any;
    hires_layer: any;
  
    data_lowres: any;
    data_hires: any;
    grid_lowres: any;
    grid_hires: any;
  
    long_name;
    difinition;
    unit;
    year;
  
    myForm:FormGroup;
    disabled = false;
    ShowFilter = false;
    limitSelection = false;
    cities = [];
    selectedItems = [];
    dropdownSettings: any = {};

    constructor(
      private calendar: NgbCalendar,
      public formatter: NgbDateParserFormatter,
      private tempService: TempService,
      private fb: FormBuilder) {
    }
    chooseyear1 = new FormGroup({
      fromyear1: new FormControl(),
      toyear1: new FormControl('', Validators.required)
    });
    chooseyear2 = new FormGroup({
      fromyear2: new FormControl('', Validators.required),
      toyear2: new FormControl('', Validators.required)
    });

    monthname:Array<Object> = [
      {id: 0, name: "January"},{id: 1, name: "Febuary"},{id: 2, name: "March"},{id: 3, name: "April"},{id: 4, name: "May"},{id: 5, name: "June"},
      {id: 6, name: "July"},{id: 7, name: "August"},{id: 8, name: "September"},{id: 9, name: "October"},{id: 10, name: "November"},{id: 11, name: "December"}
  ];
  public lists: Array<string>

  async ngOnInit() {

    this.selectedItems = [];
    this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 12,
        allowSearchFilter: this.ShowFilter
    };
    this.myForm = this.fb.group({
        city: [this.selectedItems]
    });

    console.log("yearinput", this.start_date)
    console.log("North", this.North)
    console.log("per : ",this.per)
    // this.range_y= this.startyear +'-'+ this.startyear;
    function range(start, stop, step) {
      if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
      }
      if (typeof step == 'undefined') {
        step = 1;
      }
      if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
      }

      var result = [];
      for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
      }

      return result;
    };

    this.lists = range(1901, 2019, 1)
    this.index = this.file

    await this.tempService.detail(this.data,this.index).then(data => data.subscribe(
      res => {
        console.log("detailllllll",res['color_map'])
        this.color = res['color_map']
        this.long_name = res['long name']
        this.difinition = res['description']
        this.unit = res['unit']
        this.year = res['year']
        }))

    if (this.per != 'yes') {
       this.map = MapLib.draw_map('map')

      await this.tempService.get_Avgcsv(this.data, this.index, this.startyear, this.stopyear,
        this.startmonth, this.stopmonth).then(data => data.subscribe(
          (res => { 
            // console.log(">>>>>>>>>>",res)
            let resp = JSON.parse(res)
            this.data_lowres = resp
          // get layer for add to map
            this.lowres_layer = this.getDataLayer(resp,this.North, this.South, this.West, this.East,'lowres_data')
            MapLib.clearLayers(this.map);
            this.map.getLayers().insertAt(0,this.lowres_layer);
            // MapLib.setResolution(this.map,this.North, this.South, this.West, this.East)
            MapLib.select_country(this.map)
            // this.map.getView().setCenter([115, 5])
          })
        ))

      await this.tempService.get_hire(this.data, this.index, this.startyear, this.stopyear,
        this.startmonth, this.stopmonth).then(data => data.subscribe(
          (res => { 
            // console.log(">>>>>>>>>>",res)
            let resp = JSON.parse(res)
            this.hires_layer = this.getDataLayer(resp,this.North, this.South, this.West, this.East,'hires_data')
            this.map.getLayers().insertAt(0,this.hires_layer);
            MapLib.setResolution(this.map)


          })
        ))
        }
      
    
  }
  getDataLayer(data,North,South,West,East,layername) {
    var lon = data[0]
    var lat = data[1]
    var value = data[2]
    var lon_step = data[5]
    var lat_step = data[6]
    var min_ =  data[3]
    var max_ = data[4]
    var color = data[7]
    var geojson = MapLib.merge_data_to_geojson(lon, lat, value, North,South,West,East)
    var layer = MapLib.genGridData(
      geojson, min_, max_, color, lon_step, lat_step,'main', layername
    );
    return layer
  }
// get month selected ----------------------------------------------
onItemSelect(item: any) {
  //  this.monthselect = []
  console.log('!!!onItemSelect', item);
}
onSelectAll(items: any) {
  console.log('onSelectAll', items);
}
toogleShowFilter() {
  this.ShowFilter = !this.ShowFilter;
  this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
}

handleLimitSelection() {
  if (this.limitSelection) {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
  } else {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
  }
}
// -----------read npz USE!!!!!!!!!!--------------------------------
async plot(dataset,index) {
  // this.plot_per()
  this.map = MapLib.draw_map('map')
  // MapLib.add_graticule_layer(this.map)
  console.log("dat", this.index)
  console.log(this.chooseyear1.controls['fromyear1'].value)
  console.log("plot")
  this.percent = "Work"
  console.time()

  let v
  let L = []

  await this.tempService.get_detail(dataset, index).then(data => data.subscribe(res => {
    this.color = JSON.parse(res)
    this.color = this.color[0]['color_map']
    console.log(this.color)
  }))

  await this.tempService.get_Avgcsv(dataset, index, this.startyear, this.stopyear,
    this.startmonth, this.stopmonth).then(data => data.subscribe(
      (res => { 
        // console.log(">>>>>>>>>>",res)
        let resp = JSON.parse(res)
        console.log(">>>>>>>>>",resp)
        // console.log(">>>>>>>>>",resp[3])
        var val = resp[2]
        for (v in val) {
          data = val[v]
          L.push(data)
        }
        console.log('res', L)
        console.log('min', resp[3])

        const geojson = MapLib.merge_data_to_geojson(resp[0],resp[1], val, this.North, this.South, this.West, this.East);
        this.datalayer = MapLib.genGridData(geojson, resp[3], resp[4], resp[7], resp[5], resp[6],'main','lowres_data');        // this.selectgrid = MapLib.gridselect(geojson)
        MapLib.clearLayers(this.map);
        this.map.addLayer(this.datalayer)
        MapLib.select_country(this.map)
        // MapLib.select_c(this.map)
        console.log("finish")
        console.timeEnd()
      }
      )))
}

async plot_per(){
  // this.percent = "work"
  this.monthselect = [];
  const selectValueList = this.myForm.get("city").value;
  selectValueList.map( item => {
     this.monthselect.push(item.id);
  });
  console.log("selected month : ",this.monthselect)
  if(this.monthselect.length == 0){
    console.log("!!!!!!!!!!not select month plot !!!!!!!!!!")
    this.map_range1()
  }
  else{
    console.log("!!!!!!!!!! select month !!!!!!!!!!")

    this.map_range1month()
  }
}

async plot_per2(){
  // this.percent = "work"
  this.monthselect = [];
  const selectValueList = this.myForm.get("city").value;
  selectValueList.map( item => {
     this.monthselect.push(item.id);
  });
  console.log("selected month : ",this.monthselect)
  if(this.monthselect.length == 0){
    console.log("!!!!!!!!!!not select month plot !!!!!!!!!!")
    this.map_range2()
  }
  else{
    console.log("!!!!!!!!!! select month !!!!!!!!!!")
    this.map_range2month()
  }
}

// ----------USE!!!!!!------------------------------------------------
async per_different(){
  this.type = 'per'
  this.map = MapLib.draw_map('per')
  // MapLib.add_graticule_layer(this.map)
  console.log("dat", this.index)
  console.log(this.chooseyear1.controls['fromyear1'].value)
  // this.percent = "Work"
  console.time()
  this.start1 = this.chooseyear1.controls['fromyear1'].value
  this.stop1 = this.chooseyear1.controls['toyear1'].value
  this.start2 = this.chooseyear2.controls['fromyear2'].value
  this.stop2 = this.chooseyear2.controls['toyear2'].value
  let v
  let L = []
  console.log("-----",this.index)
  await this.tempService.per_dif(this.data, this.index,this.start1, this.stop1,this.start2, this.stop2).then(data => data.subscribe(
      (res => { 
        // console.log(">>>>>>>>>>",res)
        let resp = JSON.parse(res)
        console.log(">>>>>>>>>",resp)
        // console.log(">>>>>>>>>",resp[3])
        var val = resp[2]

        const geojson = MapLib.merge_data_to_geojson(resp[0],resp[1], val, this.North, this.South, this.West, this.East);
        console.log("geojson",geojson)
        this.datalayer = MapLib.genGridData(geojson, resp[3], resp[4], resp[7], resp[5], resp[6],'main','lowres_data');
        MapLib.clearLayers(this.map);
        this.map.getLayers().insertAt(0,this.datalayer);
        MapLib.select_country(this.map)



        console.log("finish")
        console.timeEnd()

      }
      )))
}

async raw_different(){
  this.type = 'per'
  this.map = MapLib.draw_map('per')
  // this.map1 = MapLib.draw_map('map1')
  // this.map2 = MapLib.draw_map('map2')
  // MapLib.add_graticule_layer(this.map)
  console.log("dat", this.index)
  console.log(this.chooseyear1.controls['fromyear1'].value)
  this.percent = "Work"
  console.time()
  this.start1 = this.chooseyear1.controls['fromyear1'].value
  this.stop1 = this.chooseyear1.controls['toyear1'].value
  this.start2 = this.chooseyear2.controls['fromyear2'].value
  this.stop2 = this.chooseyear2.controls['toyear2'].value
  let v
  let L = []
  console.log("-----",this.index)
  await this.tempService.raw_dif(this.data, this.index,this.start1, this.stop1,this.start2, this.stop2).then(data => data.subscribe(      (res => { 
        // console.log(">>>>>>>>>>",res)
        let resp = JSON.parse(res)
        console.log(">>>>>>>>>",resp)
        // console.log(">>>>>>>>>",resp[3])
        var val = resp[2]
        // var r1 = resp[8]
        // var min1 = resp[9]
        // var max1 = resp[10]
        // var r2 = resp[11]
        // var min2 = resp[12]
        // var max2  = resp[13]
        // console.log("****",r1)
        // console.log(min1,max1)
        const geojson = MapLib.merge_data_to_geojson(resp[0],resp[1], val, this.North, this.South, this.West, this.East)
        console.log("geojson",geojson)
        this.datalayer = MapLib.genGridData(geojson, resp[3], resp[4], resp[7], resp[5], resp[6],'main','lowres_data');        MapLib.clearLayers(this.map);
        MapLib.clearLayers(this.map);
        this.map.getLayers().insertAt(0,this.datalayer);
        MapLib.select_country(this.map)
        console.log("finish")
        console.timeEnd()

      }
      )))
}

async map_range1(){
  // this.monthselect = [];
  // const selectValueList = this.myForm.get("city").value;
  // selectValueList.map( item => {
  //    this.monthselect.push(item.id);
  // });
  // console.log("selected month : ",this.monthselect)
  // if(this.monthselect.length != 0){
  //     this.differentmonth()
  // }
  // else{
    this.plot1 = ''
    this.type = 'per'
    this.map1 = MapLib.draw_map('map1')

    this.start1 = this.chooseyear1.controls['fromyear1'].value
    this.stop1 = this.chooseyear1.controls['toyear1'].value
    console.log("-----",this.index)
    await this.tempService.map_range1(this.data, this.index,this.start1, this.stop1).then(data => data.subscribe(
      (res => { 
        // console.log(">>>>>>>>>>",res)
        let resp = JSON.parse(res)
        console.log(">>>>>>>>>",resp)
        this.value1 = resp[2]
        this.min1 = resp[3]
        this.max1 = resp[4]


        const geojson1 = MapLib.merge_data_to_geojson(resp[0],resp[1], this.value1, this.North, this.South, this.West, this.East);
        // console.log("geojson",geojson1)
        this.datalayer1 = MapLib.genGridData(geojson1, this.min1, this.max1, resp[7], resp[5], resp[6],'main','lowres_data');
        MapLib.clearLayers(this.map1);
        this.map1.getLayers().insertAt(0,this.datalayer1);
        MapLib.select_country(this.map1)
        MapLib.setzoom(this.map1)
        console.log("finish")
        this.plot1 = 'plot';
        console.log("plot 1 in : ",this.plot1)
      }
      )))
      
      console.log("plot 1 :",this.plot1)
  }

async map_range1month(){
    this.monthsel = this.monthselect //[0,1,2,3]
    this.type = 'per'
    this.map1 = MapLib.draw_map('map1')

    this.start1 = this.chooseyear1.controls['fromyear1'].value
    this.stop1 = this.chooseyear1.controls['toyear1'].value
    console.log("-----",this.index)
    await this.tempService.map_range1month(this.data, this.index,this.start1,this.stop1,this.monthsel).then(data => data.subscribe(
      (res => { 
        // console.log(">>>>>>>>>>",res)
        let resp = JSON.parse(res)
        console.log(">>>>>>>>>",resp)
        this.value1 = resp[2]
        this.min1 = resp[3]
        this.max1 = resp[4]


        const geojson1 = MapLib.merge_data_to_geojson(resp[0],resp[1], this.value1, this.North, this.South, this.West, this.East);
        // console.log("geojson",geojson1)
        this.datalayer1 = MapLib.genGridData(geojson1, this.min1, this.max1, resp[7], resp[5], resp[6],'main','lowres_data');
        MapLib.clearLayers(this.map1);
        this.map1.getLayers().insertAt(0,this.datalayer1);
        MapLib.select_country(this.map1)
        MapLib.setzoom(this.map1)
        console.log("finish")
      }
      )))
  }

async map_range2(){
  this.type = 'per'
  this.plot2 = ''
  // this.map1 = MapLib.draw_map('map1')
  this.map2 = MapLib.draw_map('map2')
  // MapLib.add_graticule_layer(this.map)
  console.log("dat", this.index)

  // this.percent = "Work"

  this.start1 = this.chooseyear2.controls['fromyear2'].value
  this.stop1 = this.chooseyear2.controls['toyear2'].value

  console.log("-----",this.index)
  await this.tempService.map_range1(this.data, this.index,this.start1, this.stop1).then(data => data.subscribe(
      (res => { 
        // console.log(">>>>>>>>>>",res)
        let resp = JSON.parse(res)
        console.log(">>>>>>>>>",resp)
        var value = resp[2]
        var min1 = resp[3]
        var max1 = resp[4]
        // console.log("****",r1)
        // console.log(min1,max1)

        const geojson2 = MapLib.merge_data_to_geojson(resp[0],resp[1], value, this.North, this.South, this.West, this.East);
        // console.log("geojson",geojson1)
        this.datalayer2 = MapLib.genGridData(geojson2, this.min1, this.max1, resp[7], resp[5], resp[6],'main','lowres_data');
        MapLib.clearLayers(this.map2);
        this.map2.getLayers().insertAt(0,this.datalayer2);
        MapLib.select_country(this.map2)
        MapLib.setzoom(this.map2)

        console.log("finish")
        console.timeEnd()
        this.plot2 = 'plot';
      }
      )))
      console.log("plot 2 : ",this.plot2, "this status")
  }

  async map_range2month(){
    this.monthsel = this.monthselect //[0,1,2,3]
    this.type = 'per'
    this.plot2 = ''
    // this.map1 = MapLib.draw_map('map1')
    this.map2 = MapLib.draw_map('map2')
    // MapLib.add_graticule_layer(this.map)
    console.log("dat", this.index)
  
    // this.percent = "Work"
  
    this.start1 = this.chooseyear2.controls['fromyear2'].value
    this.stop1 = this.chooseyear2.controls['toyear2'].value
  
    console.log("-----",this.index)
    await this.tempService.map_range2month(this.data, this.index,this.start1, this.stop1,this.monthsel).then(data => data.subscribe(
        (res => { 
          // console.log(">>>>>>>>>>",res)
          let resp = JSON.parse(res)
          console.log(">>>>>>>>>",resp)
          var value = resp[2]
          var min1 = resp[3]
          var max1 = resp[4]
          // console.log("****",r1)
          // console.log(min1,max1)
  
          const geojson2 = MapLib.merge_data_to_geojson(resp[0],resp[1], value, this.North, this.South, this.West, this.East);
          // console.log("geojson",geojson1)
          this.datalayer2 = MapLib.genGridData(geojson2, this.min1, this.max1, resp[7], resp[5], resp[6],'main','lowres_data');
          MapLib.clearLayers(this.map2);
          this.map2.getLayers().insertAt(0,this.datalayer2);
          MapLib.select_country(this.map2)
          MapLib.setzoom(this.map2)
  
          console.log("finish")
          console.timeEnd()
          this.plot2 = 'plot';
        }
        )))
        console.log("plot 2 : ",this.plot2, "this status")
    }

// ---------- difference selected month ------------------------------
async differentmonth(){
  this.type = 'per'
  this.map1 = MapLib.draw_map('map1')
  // MapLib.add_graticule_layer(this.map)
  console.log("dat", this.index)
  console.log(this.chooseyear1.controls['fromyear1'].value)
  this.percent = "Work"
  console.time()
  this.start1 = this.chooseyear1.controls['fromyear1'].value
  this.stop1 = this.chooseyear1.controls['toyear1'].value
  
  this.monthselect = [];
  const selectValueList = this.myForm.get("city").value;
  selectValueList.map( item => {
     this.monthselect.push(item.id);
  });
  console.log("month id: ", this.monthselect)
  let v
  let L = []
  this.monthsel = this.monthselect //[0,1,2,3]
  console.log("-----",this.index)
  await this.tempService.nc_permonth(this.data, this.index,this.start1, this.stop1,this.monthsel).then(data => data.subscribe(      (res => { 
        // console.log(">>>>>>>>>>",res)
        let resp = JSON.parse(res)
        console.log(">>>>>>>>>",resp)
        // console.log(">>>>>>>>>",resp[3])
        var val = resp[2]
        var r1 = resp[8]
        var min1 = resp[9]
        var max1 = resp[10]
        var r2 = resp[11]
        var min2 = resp[12]
        var max2  = resp[13]
        console.log("****",r1)
        console.log(min1,max1)
        const geojson1 = MapLib.merge_data_to_geojson(resp[0],resp[1], this.value1, this.North, this.South, this.West, this.East);
        // console.log("geojson",geojson1)
        this.datalayer1 = MapLib.genGridData(geojson1, this.min1, this.max1, resp[7], resp[5], resp[6],'main','lowres_data');
        MapLib.clearLayers(this.map1);
        this.map1.getLayers().insertAt(0,this.datalayer1);
        MapLib.select_country(this.map1)
        MapLib.setzoom(this.map1)
        console.log("finish")
        this.plot1 = 'plot';
        console.log("plot 1 in : ",this.plot1)
      }
      )))
  }

}