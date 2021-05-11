import { Component, OnInit ,OnChanges} from '@angular/core';
import 'ol/ol.css';
import * as MapLib from 'src/app/netcdf/lib/map.js';
import { TempService } from 'src/app/services/temp.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable, range } from 'rxjs';
import { geojson } from 'highcharts';
import { data } from 'jquery';
// import { RecieveDataService } from 'src/app/home/data.service';
import { InputService } from "src/app/services/input.service";

@Component({
  selector: 'app-difference',
  templateUrl: './difference.component.html',
  styleUrls: ['./difference.component.css'],
  providers:[TempService]
})
export class DifferenceComponent implements OnInit {
  
  lists;
  map;
  dataset;
  index;
  start1;
  stop1;
  start2;
  stop2;

  map1;
  map2;
  value1;
  min1;
  max1;

  North;
  South;
  West;
  East;

  dataset_name;
  long_name;
  difinition;
  unit;
  year;

  monthsel ;
  public monthselect = [];

  myForm:FormGroup;

  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  cities = [];
  selectedItems = [];
  dropdownSettings: any = {};
  display;
  Ranges;
  Ranges2;
  Input;
  color_map;
  types;
  rcp;
  

  constructor(
    public formatter: NgbDateParserFormatter,
    private tempService: TempService,
    private sharedData: InputService,
    private fb: FormBuilder
  ) { }

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

getDataLayer(data, North, South, West, East, layername, name_legend, type, color, unit) {
  var lon = data[0]
  var lat = data[1]
  var value = data[2]
  var lon_step = data[5]
  var lat_step = data[6]
  var min_ = data[3]
  var max_ = data[4]
  var color = color
  var unit = unit
  var geojson = MapLib.convert_to_geojson(value, lon, lat)
  var merge = MapLib.merge_data_to_geojson(geojson, value, North, South, West, East, 'value')
  var layer = MapLib.genGridData(
    merge, min_, max_, color, unit, lon_step, lat_step, type, layername, name_legend);
  return layer
}

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

    this.map1 = MapLib.draw_map('map1')
    this.map2 = MapLib.draw_map('map2')
    this.map = MapLib.draw_map('dif')

    this.sharedData.Detailservice.subscribe(data => {
      if (data) {
        console.log("input Detail", data)
        this.unit = data[0].unit
        this.difinition = data[0].description
        this.long_name = data[0].long_name
        this.color_map = data[0].color_map
        this.year = data[0].year
        var start = data[0].year.split("-")[0]
        var stop = data[0].year.split("-")[1]
        this.index = data[2]
        this.dataset = data[1]
        this.Range(start, stop)
        this.clear()
        this.chooseyear1.patchValue({
          fromyear1: null,
          toyear1: null
        })
        this.chooseyear2.patchValue({
          fromyear2: null,
          toyear2: null
        })
      }
    })

    
    await this.sharedData.difservice.subscribe(data => {
      if (data) {
        console.log("input dif", data)
        
        
        
        if(data[0].types == 'y'){
          console.log("type year",data[0].types)
          this.disabled = true
        }

        // this.dataset = data[0]
        // this.index = data[1]
      }
    })

    this.sharedData.regionservice.subscribe(data => {
      if (data) {
        console.log("input region", data)
        this.North = data[0]
        this.South = data[1]
        this.West = data[2]
        this.East = data[3]
      }
    })

    this.sharedData.difservice.subscribe(data => {
      if (data) {
        console.log("input dif", data)
        this.Input = data[0]
      }
    })
  }

  async clear(){
    this.display = 'clear'
    MapLib.clearLayers(this.map1);
    MapLib.clearLayers(this.map2);
    MapLib.clearLayers(this.map);
  }

  async Range(x, y) {
    var start_y = Number(x)
    var stop_y = Number(y)
    function counter(start: number, stop: number) {
      var result = [];
      for (var i = start; 1 > 0 ? i < stop : i > stop; i += 1) {
        result.push(i)
      }
      return result;
    }
    this.lists = counter(start_y, stop_y + 1)
  }


  
  async map_range1() {
    this.display = 'show'
    this.start1 = this.chooseyear1.controls['fromyear1'].value
    this.stop1 = this.chooseyear1.controls['toyear1'].value
    this.Ranges = 'Year ' + this.start1 + '-' + this.stop1
    await this.tempService.map_range1(this.Input.dataset, this.Input.index, this.start1, this.stop1, this.Input.rcp, this.Input.types).then(data => data.subscribe(
      (res => {
        let resp = JSON.parse(res)
        this.min1 = resp[3]
        this.max1 = resp[4]
        const data_dif = this.getDataLayer(resp, this.North, this.South, this.West, this.East, 'lowres_data', 'map1', 'main', this.color_map, this.unit)
        MapLib.clearLayers(this.map1);
        this.map1.getLayers().insertAt(0, data_dif);
        MapLib.select_country(this.map1)
      })
    ))
  }

  async map_range2() {
    this.display = 'show'
    this.start2 = this.chooseyear2.controls['fromyear2'].value
    this.stop2 = this.chooseyear2.controls['toyear2'].value
    this.Ranges2 = 'Year ' + this.start2 + '-' + this.stop2
    await this.tempService.map_range2(this.Input.dataset, this.Input.index, this.start1, this.stop1, this.Input.rcp, this.Input.types).then(data => data.subscribe(
      (res => {
        let resp = JSON.parse(res)
        var value = resp[2]
        var geojson = MapLib.convert_to_geojson(value, resp[0], resp[1],)
        var merge = MapLib.merge_data_to_geojson(geojson, value, this.North, this.South, this.West, this.East, 'value')
        const datalayer2 = MapLib.genGridData(merge, this.min1, this.max1, this.color_map, this.unit, resp[5], resp[6], 'main', 'lowres_data', 'map2');
        MapLib.clearLayers(this.map2);
        this.map2.getLayers().insertAt(0, datalayer2);
        MapLib.select_country(this.map2)
      })
    ))
  }

  async per_different() {
    this.display= 'show'
    this.start1 = this.chooseyear1.controls['fromyear1'].value
    this.stop1 = this.chooseyear1.controls['toyear1'].value
    this.start2 = this.chooseyear2.controls['fromyear2'].value
    this.stop2 = this.chooseyear2.controls['toyear2'].value
    await this.tempService.per_dif(this.Input.dataset, this.Input.index, this.start1, this.stop1, this.start2, this.stop2, this.Input.rcp, this.Input.types).then(data => data.subscribe(
      (res => {
        let resp = JSON.parse(res)
        const data_dif = this.getDataLayer(resp, this.North, this.South, this.West, this.East, 'lowres_data', 'mapdif', 'per', this.color_map, this.unit)
        MapLib.clearLayers(this.map);
        this.map.getLayers().insertAt(0, data_dif);
        MapLib.select_country(this.map)
      })
    ))
  }

  async raw_different() {
    this.display = 'show'
    this.start1 = this.chooseyear1.controls['fromyear1'].value
    this.stop1 = this.chooseyear1.controls['toyear1'].value
    this.start2 = this.chooseyear2.controls['fromyear2'].value
    this.stop2 = this.chooseyear2.controls['toyear2'].value

    await this.tempService.raw_dif(this.Input.dataset, this.Input.index, this.start1, this.stop1, this.start2, this.stop2, this.Input.rcp, this.Input.types).then(data => data.subscribe(
      (res => {
        let resp = JSON.parse(res)
        console.log(">>>>>>>>>", resp)
        // const geojson = MapLib.merge_data_to_geojson(resp[0],resp[1], val, this.North, this.South, this.West, this.East,'value');
        // console.log("geojson",geojson)
        // var datalayer = MapLib.genGridData(geojson, resp[3], resp[4], resp[7], resp[5], resp[6],'main','lowres_data');
        const data_dif = this.getDataLayer(resp, this.North, this.South, this.West, this.East, 'lowres_data', 'mapdif', 'main', this.color_map, this.unit)
        MapLib.clearLayers(this.map);
        this.map.getLayers().insertAt(0, data_dif);
        MapLib.select_country(this.map)
        console.log("finish")
        console.timeEnd()

      })
    ))
  }

    // async per_different(){
    //   this.display = 'show'
    //   // MapLib.add_graticule_layer(this.map)
    //   console.log("dat", this.index)
    //   console.log(this.chooseyear1.controls['fromyear1'].value)
    //   // this.percent = "Work"
    //   console.time()
    //   this.start1 = this.chooseyear1.controls['fromyear1'].value
    //   this.stop1 = this.chooseyear1.controls['toyear1'].value
    //   this.start2 = this.chooseyear2.controls['fromyear2'].value
    //   this.stop2 = this.chooseyear2.controls['toyear2'].value
    //   let v
    //   let L = []
    //   console.log("-----",this.index)
    //   await this.tempService.per_dif(this.dataset, this.index,this.start1, this.stop1,this.start2, this.stop2).then(data => data.subscribe(
    //       (res => { 
    //         // console.log(">>>>>>>>>>",res)
    //         let resp = JSON.parse(res)
    //         console.log(">>>>>>>>>",resp)
    //         // console.log(">>>>>>>>>",resp[3])
    //         var val = resp[2]
    //         const data_dif = this.getDataLayer(resp, this.North, this.South, this.West, this.East, 'lowres_data','mapdif','per')
    //         // const geojson = MapLib.merge_data_to_geojson(resp[0],resp[1], val, this.North, this.South, this.West, this.East,'value');
    //         // console.log("geojson",geojson)
    //         // const datalayer = MapLib.genGridData(geojson, resp[3], resp[4], resp[7], resp[5], resp[6],'main','lowres_data');
    //         MapLib.clearLayers(this.map);
    //         this.map.getLayers().insertAt(0,data_dif);
    //         MapLib.select_country(this.map)
    //         console.log("finish")
    //         console.timeEnd()

    //       }
    //       )))
    // }

    // async raw_different(){
    //   this.display = 'show'
    //   console.log("dat", this.index)
    //   console.log(this.chooseyear1.controls['fromyear1'].value)
    //   console.time()
    //   this.start1 = this.chooseyear1.controls['fromyear1'].value
    //   this.stop1 = this.chooseyear1.controls['toyear1'].value
    //   this.start2 = this.chooseyear2.controls['fromyear2'].value
    //   this.stop2 = this.chooseyear2.controls['toyear2'].value

    //   await this.tempService.raw_dif(this.dataset, this.index,this.start1, this.stop1,this.start2, this.stop2).then(data => data.subscribe(
    //       (res => { 
    //         let resp = JSON.parse(res)
    //         console.log(">>>>>>>>>",resp)
    //         var val = resp[2]
    //         // const geojson = MapLib.merge_data_to_geojson(resp[0],resp[1], val, this.North, this.South, this.West, this.East,'value');
    //         // console.log("geojson",geojson)
    //         // var datalayer = MapLib.genGridData(geojson, resp[3], resp[4], resp[7], resp[5], resp[6],'main','lowres_data');
    //         const data_dif = this.getDataLayer(resp, this.North, this.South, this.West, this.East, 'lowres_data','mapdif','main')
    //         MapLib.clearLayers(this.map);
    //         this.map.getLayers().insertAt(0,data_dif);
    //         MapLib.select_country(this.map)

    //         console.log("finish")
    //         console.timeEnd()

    //       }
    //       )))
    // }

  // async map_range1() {
  //   this.display = 'show'
  //   this.start1 = this.chooseyear1.controls['fromyear1'].value
  //   this.stop1 = this.chooseyear1.controls['toyear1'].value
  //   this.Ranges = 'Year ' + this.start1 + '-' + this.stop1 
  //   await this.tempService.map_range1(this.dataset, this.index, this.start1, this.stop1).then(data => data.subscribe(
  //     (res => {
  //       let resp = JSON.parse(res)
  //       console.log(">>>>>>>>>", resp)
  //       this.min1 = resp[3]
  //       this.max1 = resp[4]
  //       const data_dif = this.getDataLayer(resp, this.North, this.South, this.West, this.East, 'lowres_data','map1','main')
  //       MapLib.clearLayers(this.map1);
  //       this.map1.getLayers().insertAt(0, data_dif);
  //       MapLib.select_country(this.map1)
  //       MapLib.setzoom(this.map1)

  //       console.log("finish")
  //     })
  //   ))
  // }

  // async map_range2() {
  //   this.display = 'show'
  //   this.start2 = this.chooseyear2.controls['fromyear2'].value
  //   this.stop2 = this.chooseyear2.controls['toyear2'].value
  //   this.Ranges2 = 'Year ' + this.start2 + '-' + this.stop2 
  //   await this.tempService.map_range2(this.dataset, this.index, this.start2, this.stop2).then(data => data.subscribe(
  //     (res => {
  //       let resp = JSON.parse(res)
  //       console.log(">>>>>>>>>", resp[7])
  //       var value = resp[2]
  //       var geojson = MapLib.convert_to_geojson(value,resp[0], resp[1],)
  //       var merge = MapLib.merge_data_to_geojson(geojson, value, this.North, this.South, this.West, this.East,'value')
  //       // var layer = MapLib.genGridData(
  //       //   merge, min_, max_, color, lon_step, lat_step,'main', layername
  //       // );
  //       // const geojson2 = MapLib.merge_data_to_geojson(resp[0], resp[1], value, this.North, this.South, this.West, this.East, 'value');
  //       const datalayer2 = MapLib.genGridData(merge, this.min1, this.max1, resp[7], resp[5], resp[6], 'main', 'lowres_data','map2');
  //       // const data_dif = this.getDataLayer(resp,this.North, this.South, this.West, this.East,'lowres_data')
  //       MapLib.clearLayers(this.map2);
  //       this.map2.getLayers().insertAt(0, datalayer2);
  //       MapLib.select_country(this.map2)
  //       MapLib.setzoom(this.map2)

  //     }
  //     )))
  // }

  // select specific month ---------------------------------------------------------------------------------------- 

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

  async map_range1select() {
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

  async map_range2select() {
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

  async map_range1month(){
    this.monthsel = this.monthselect //[0,1,2,3]
    this.start1 = this.chooseyear1.controls['fromyear1'].value
    this.stop1 = this.chooseyear1.controls['toyear1'].value
    this.Ranges = 'Year ' + this.start1 + '-' + this.stop1
    console.log("map month dataset >>>",this.dataset)

    await this.tempService.map_range1month(this.Input.dataset, this.Input.index, this.start1, this.stop1,this.monthsel,this.Input.rcp, this.Input.types).then(data => data.subscribe(
      (res => { 
        let resp = JSON.parse(res)
        console.log(">>>>>>>>>", resp)
        this.min1 = resp[3]
        this.max1 = resp[4]
        const data_dif = this.getDataLayer(resp, this.North, this.South, this.West, this.East, 'lowres_data', 'map1', 'main', this.color_map, this.unit)
        MapLib.clearLayers(this.map1);
        this.map1.getLayers().insertAt(0, data_dif);
        MapLib.select_country(this.map1)
        MapLib.setzoom(this.map1)

      }
      )))
  }

  async map_range2month() {
    this.monthsel = this.monthselect //[0,1,2,3]
    this.start2 = this.chooseyear2.controls['fromyear2'].value
    this.stop2 = this.chooseyear2.controls['toyear2'].value
    this.Ranges2 = 'Year ' + this.start2 + '-' + this.stop2

    await this.tempService.map_range2month(this.Input.dataset, this.Input.index, this.start1, this.stop1,this.monthsel,this.Input.rcp, this.Input.types).then(data => data.subscribe(
      (res => {
        let resp = JSON.parse(res)
        console.log(">>>>>>>>>", resp[7])
        var value = resp[2]
        var geojson = MapLib.convert_to_geojson(value,resp[0], resp[1],)
        var merge = MapLib.merge_data_to_geojson(geojson, value, this.North, this.South, this.West, this.East,'value')
        const datalayer2 = MapLib.genGridData(merge, this.min1, this.max1, this.color_map, this.unit, resp[5], resp[6], 'main', 'lowres_data', 'map2');
        MapLib.clearLayers(this.map2);
        this.map2.getLayers().insertAt(0, datalayer2);
        MapLib.select_country(this.map2)

      }
      )))
  }




}