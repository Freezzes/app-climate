
// export class HomeComponent implements OnInit {
//   menuItems: any[];

//   hoveredDate: NgbDate | null = null;
//   fromDate: NgbDate | null = null;
//   toDate: NgbDate | null = null;
//   public dataset;
//   public file;
//   public getdataset: any;
//   public station;
//   start_date;
//   stop_date;
//   public lenght_y;

//   dataset_name;
//   index_name;
//   selectedDevice;
//   dataset_input;
//   index_;
//   plot_trend: boolean = true;
//   constructor(
//     private calendar: NgbCalendar,
//     public formatter: NgbDateParserFormatter,
//     private dataService: DataService,
//     private inputservice: InputService) {
//   }

//   Indices = [
//     {id: 'rcp45', name: 'rcp45'},
//     {id: 'rcp85', name: 'rcp85'},
//   ];

//   choosedataset = new FormGroup({
//     set: new FormControl()
//   });

//   chooseRCM = new FormGroup({
//     rcp: new FormControl()
//   });

//   chooseindex = new FormGroup({
//     file: new FormControl(),
//   });

//   currentOrientation = 'vertical';
//   selectDataTab;

//   async onChange(newValue) {
//     console.log(newValue)
//     this.dataset_input = newValue

//     this.chooseindex.patchValue({
//       file: null
//     })

//     if (newValue == 'ec-earth' || newValue == 'mpi-esm-mr'  || newValue == 'hadgem2-es'
//     ){
//       (document.getElementById("rcp") as any).disabled = false;
//     }
//     else{
//       (document.getElementById("rcp") as any).disabled = true;
//     }

//     if (newValue != 'tmd'){
//       (document.getElementById("station") as any).disabled = true;
//     }
//     else{
//       (document.getElementById("station") as any).disabled = false;
//     }
   
//     await this.dataService.detail(this.dataset_input, this.index_).then(data => data.subscribe(
//       res => {
//         console.log("qqqqq",res.year)
//         var year = String(res.year).split("-")
//         this.start_date = {year: Number(year[0]), month: 1, day: 1}
//         this.stop_date = {year: Number(year[1]), month: 11, day: 1}
//         var sent = [res,this.dataset_input,this.index_]
//         this.inputservice.sendDetail(sent)
//       }
//     ))

//     this.dataService.get_index(this.dataset_input).then(data => data.subscribe(
//       res => {
//         this.index_name = res
//       }
//     ))

//   }
//   async onChangeIndex(newvalue){
//     this.index_ = newvalue
//     console.log("index",newvalue)
//     await this.dataService.detail(this.dataset_input, newvalue).then(data => data.subscribe(
//       res => {
//         console.log("qqqqq",res.year)
//         var year = String(res.year).split("-")
//         this.start_date = {year: Number(year[0]), month: 1, day: 1}
//         this.stop_date = {year: Number(year[1]), month: 11, day: 1}
//         var sent = [res,this.dataset_input,this.index_]
//         this.inputservice.sendDetail(sent)
//       }
//     ))

//   }
//   // North = new FormControl('90', Validators.required);
//   // South = new FormControl('-90', Validators.required);
//   // West = new FormControl('-180', Validators.required);
//   // East = new FormControl('180', Validators.required);
//   North = new FormControl('85', Validators.required);
//   South = new FormControl('-15', Validators.required);
//   West = new FormControl('20', Validators.required);
//   East = new FormControl('180', Validators.required);


//   select;
//   per;
//   chart;
//   year;
//   button;

//   async ngOnInit() {

//     this.dataService.get_dataset().then(data => data.subscribe(
//       res => {
//         this.dataset_name = res
//       })
//     )

//   }

//   async get_raw_data() {
//     this.plot_trend = false
//     this.select = 'get_data'
//     console.log("get_data")
//     this.dataset = this.choosedataset.controls['set'].value
//     var index = this.chooseindex.controls['file'].value
//     var startyear = String(this.fromDate.year)
//     var stopyear = String(this.toDate.year)
//     var startmonth = String(this.fromDate.month)
//     var stopmonth = String(this.toDate.month)
//     // var region = [this.North.value, this.South.value, this.West.value, this.East.value]
//     this.per = "no"
//     console.log(this.dataset)

//     var region = [this.North.value, this.South.value, this.West.value, this.East.value]
//     await this.inputservice.sendRegion(region)

//     var inputs = { 'dataset': this.dataset, 'index': index, 'startyear': startyear, 'stopyear': stopyear, 'startmonth': startmonth, 'stopmonth': stopmonth, 'plottrend': this.plot_trend }
//     await this.inputservice.sendInput(inputs)

//     // await this.dataService.detail(this.dataset, index).then(data => data.subscribe(
//     //   res => {
//     //     this.inputservice.sendDetail(res)
//     //   }
//     // ))

//     await this.dataService.get_lowres(this.dataset, index, startyear, stopyear, startmonth, stopmonth)
//       .then(data => data.subscribe(
//         (res => {
//           // console.log("check dataaaaaa",res)
//           let resp = JSON.parse(res)
//           // console.log("datampi",resp)
//           var inputs = { 'dataset': this.dataset, 'index': index, 'startyear': startyear, 'stopyear': stopyear, 'startmonth': startmonth, 'stopmonth': stopmonth }
//           this.dataService.global_avg(this.dataset, index, startyear, startmonth, stopyear, stopmonth)
//             .then(datas => datas.subscribe(res => {
//               var data = Number(stopyear) - Number(startyear)
//               console.log("dddddd", data)
//               var start = Number(startyear)
//               for (var i = 0; i <= data; i++) {
//                 Data.dataPoints.push(
//                   { x: new Date(start, 0), y: res[0][i] },
//                 )
//                 start += 1
//               }
//               console.log("point", Data.dataPoints)
//               this.chart = [Data.dataPoints, res[1], res[2], 'Golbal']
//               var sent = { 'chart': this.chart, 'map': resp, 'input': inputs }
//               this.inputservice.sendLowRes(sent)

//             }))
//         })
//       ))

//     await this.dataService.global_avg(this.dataset, index, startyear, startmonth, stopyear, stopmonth)
//       .then(datas => datas.subscribe(res => {
//         var data = Number(stopyear) - Number(startyear)
//         console.log("dddddd", data)
//         var start = Number(startyear)
//         for (var i = 0; i <= data; i++) {
//           Data.dataPoints.push(
//             { x: new Date(start, 0), y: res[0][i] },
//           )
//           start += 1
//         }
//         console.log("point", Data.dataPoints)
//         this.chart = [Data.dataPoints, res[1], res[2], 'Golbal']
//         // var sent = { 'chart': this.chart,'input': inputs }
//         this.inputservice.sendGraphAvg(this.chart)

//       }))

//     // await this.dataService.get_hire(this.dataset, index, startyear, stopyear, startmonth, stopmonth)
//     //   .then(data => data.subscribe(
//     //     (res => {
//     //       // console.log("mpi",res)
//     //       let resp = JSON.parse(res)
//     //       console.log("datampi",resp)
//     //       this.inputservice.sendHiRes(resp)
//     //       // this.inputservice.sendHiRes(resp)
//     //     })
//     //   ))

//     var Data = {
//       dataPoints: []
//     }

//     await this.dataService.nc_anomaly(index).then(data => data.subscribe(res => {
//       console.log('ano', res)
//       this.inputservice.sendanomaly(res)
//     }))
//   }

//   async get_difference() {
//     this.select = 'get_dif'
//     var data = this.choosedataset.controls['set'].value
//     var index = this.chooseindex.controls['file'].value
//     // await this.dataService.detail(data, index).then(data => data.subscribe(
//     //   res => {
//     //     this.inputservice.sendDetail(res)
//     //     console.log("detail dif", res)
//     //     var year = res.year
//     //   }
//     // ))

//     var region = [this.North.value, this.South.value, this.West.value, this.East.value]
//     await this.inputservice.sendRegion(region)
//     var clear = 'clear'
//     var sent = [data, index,clear]
//     this.inputservice.senddif(sent)
//   }

//   async station_thai() {
//     this.select = "station"
//     var index = this.chooseindex.controls['file'].value
//     var startyear = String(this.fromDate.year)
//     var stopyear = String(this.toDate.year)
//     var startmonth = String(this.fromDate.month)
//     var stopmonth = String(this.toDate.month)
//     await this.dataService.getdata_sta(index,startyear,stopyear,startmonth,stopmonth).then(res => {
//         res.subscribe(datas => {
//           this.inputservice.sendstation(datas)
//         })

//     })
//   }

//   percent() {
//     this.select = "percent"
//     this.per = "yes"
//   }

//   checktrue_values() {
//     if (this.dataset) {
//       return false;
//     }
//     else {
//       return true;
//     }
//   }

//   onDateSelection(date: NgbDate) {
//     if (!this.fromDate && !this.toDate) {
//       this.fromDate = date;
//     } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
//       this.toDate = date;
//     } else {
//       this.toDate = null;
//       this.fromDate = date;
//     }
//   }

//   isHovered(date: NgbDate) {
//     return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
//   }

//   isInside(date: NgbDate) {
//     return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
//   }

//   isRange(date: NgbDate) {
//     return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
//   }

//   validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
//     const parsed = this.formatter.parse(input);
//     // console.log("vali", parsed)
//     return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
//   }
// }


import { Component, OnInit, ViewChild, AfterViewInit, OnChanges, DoCheck } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as $ from 'jquery';
import { DataService } from 'src/app/services/data.service';
import { InputService } from "src/app/services/input.service";
// declare var $:JQueryStatic
import { NgbPanelChangeEvent, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import accordion from 'angular-ui-bootstrap/src/accordion';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DataService]

})


export class HomeComponent implements OnInit {
  @ViewChild('myaccordion', { static: true }) accordion: NgbAccordion;

  // menuItems: any[];

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;
  public dataset;
  public file;
  public getdataset: any;
  public station;
  start_date;
  stop_date;
  public lenght_y;

  dataset_name;
  dataset_name_rcp
  index_name;
  indexrcp_name;
  selectedDevice;
  dataset_input;
  index_;
  plot_trend: boolean = true;
  selectedStartYear;
  // config: Config;
  dataset_rgm;

  currentOrientation = 'vertical';
  selectDataTab;

  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private dataService: DataService,
    private inputservice: InputService
    // private tempService: TempService,
  ) { }

  RCP = [
    { id: 'rcp45', name: 'RCP 4.5' },
    { id: 'rcp85', name: 'RCP 8.5' },
  ];

  M_Y = [
    { id: 'm', name: 'month' },
    { id: 'y', name: 'year' },
  ];

  month = ['Jan', 'Fab', 'Mach', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  choosedataset = new FormGroup({
    raw: new FormControl(),
    rcp: new FormControl()
  });

  chooseRCM = new FormGroup({
    rcp: new FormControl()
  });

  choose_m_y = new FormGroup({
    m_y: new FormControl()
  });

  chooseindex = new FormGroup({
    index: new FormControl(),
    indices: new FormControl()
  });

  selectrange = new FormGroup({
    startyear: new FormControl(),
    stopyear: new FormControl(),
    startmonth: new FormControl(),
    stopmonth: new FormControl()
  })

  counter(start: number, stop: number) {
    var result = [];
    for (var i = start; 1 > 0 ? i < stop : i > stop; i += 1) {
      result.push(i)
    }
    return result;
  }


  async onChangetype(newValue) {
    console.log("type", newValue)
    this.dataService.get_index_rcp(newValue).then(data => data.subscribe(
      res => {
        this.indexrcp_name = res
      }
    ))

    // await this.dataService.detail_rcp(this.dataset_input, this.index_, this.choose_m_y.controls['m_y'].value).then(data => data.subscribe(
    //   res => {
    //     console.log("detail", res)
    //     var year = String(res.year).split("-")
    //     this.start_date = { year: Number(year[0]), month: 1, day: 1 }
    //     this.stop_date = { year: Number(year[1]), month: 11, day: 1 }
    //     var sent = [res, this.dataset_rgm, this.index_]
    //     this.inputservice.sendDetail(sent)
    //   }
    // ))

    if (newValue == 'm') {
      (document.getElementById("semonth") as any).disabled = false;
      (document.getElementById("semonth1") as any).disabled = false;
    }
    else {
      (document.getElementById("semonth") as any).disabled = true;
      (document.getElementById("semonth1") as any).disabled = true;
    }
  }

  async onchangedataset_rcp(newvalue){
    this.dataset_rgm= newvalue
    this.choosedataset.patchValue({
      raw:null
    })
    this.chooseindex.patchValue({
      index: null
    })

    // await this.dataService.detail_rcp(newvalue, this.index_, this.choose_m_y.controls['m_y'].value).then(data => data.subscribe(
    //   res => {
    //     console.log("detail", res)
    //     var year = String(res.year).split("-")
    //     this.start_date = { year: Number(year[0]), month: 1, day: 1 }
    //     this.stop_date = { year: Number(year[1]), month: 11, day: 1 }
    //     var sent = [res, newvalue, this.index_]
    //     var sent = [res, this.dataset_rgm, this.index_,this.chooseRCM.controls['rcp'].value,this.choose_m_y.controls['m_y'].value]
    //     this.inputservice.sendDetail(sent)
    //   }
    // ))
  }

  async onChange(newValue) {
    console.log(newValue)
    this.dataset_input = newValue

    this.choosedataset.patchValue({
      rcp:null
    })
    this.chooseindex.patchValue({
      index: null,
      indices: null
    })
    this.chooseRCM.patchValue({
      rcp: null
    })
    this.choose_m_y.patchValue({
      m_y: null
    })

    if (newValue != 'tmd') {
      (document.getElementById("station") as any).disabled = true;
    }
    else {
      (document.getElementById("station") as any).disabled = false;
    }

    // await this.dataService.detail(this.dataset_input, this.index_).then(data => data.subscribe(
    //   res => {
    //     console.log("qqqqq", res)
    //     var year = String(res.year).split("-")
    //     this.start_date = { year: Number(year[0]), month: 1, day: 1 }
    //     this.stop_date = { year: Number(year[1]), month: 11, day: 1 }
    //     var sent = [res, this.dataset_input, this.index_]
    //     this.inputservice.sendDetail(sent)
    //   }
    // ))

    this.dataService.get_index(this.dataset_input).then(data => data.subscribe(
      res => {
        this.index_name = res
      }
    ))

  }
  async onChangeIndex(newvalue) {
    this.index_ = newvalue
    console.log("index", newvalue)
    if (this.index_ == 'tas' || this.index_ == 'tasmin' || this.index_ == 'tasmax' || this.index_ == 'pr') {
      await this.dataService.detail(this.dataset_input, newvalue).then(data => data.subscribe(
        res => {
          console.log("detail", res)
          var year = String(res.year).split("-")
          this.start_date = { year: Number(year[0]), month: 1, day: 1 }
          this.stop_date = { year: Number(year[1]), month: 11, day: 1 }
          var sent = [res, this.dataset_input, this.index_]
          this.inputservice.sendDetail(sent)
        }
      ))
      var sent = [{ 'dataset': this.dataset_input, 'index': this.index_, 'rcp': 'None', 'types': 'None', 'clear': 'clear' }]
    // var sent = [dataset, index, clear]
    this.inputservice.senddif(sent)
    }
    else {
      await this.dataService.detail_rcp(this.dataset_rgm, newvalue, this.choose_m_y.controls['m_y'].value).then(data => data.subscribe(
        res => {
          console.log("detail", res)
          var year = String(res.year).split("-")
          this.start_date = { year: Number(year[0]), month: 1, day: 1 }
          this.stop_date = { year: Number(year[1]), month: 11, day: 1 }
          var sent = [res, this.dataset_rgm, this.index_]
          this.inputservice.sendDetail(sent)
        }
      ))

      var sent_rcp = [{ 'dataset': this.dataset_rgm, 'index': this.index_, 'rcp': this.chooseRCM.controls['rcp'].value, 'types': this.choose_m_y.controls['m_y'].value, 'clear': 'clear' }]
      // var sent = [dataset, index, clear]
      this.inputservice.senddif(sent_rcp)
    }

    

  }

  North = new FormControl('85', Validators.required);
  South = new FormControl('-15', Validators.required);
  West = new FormControl('20', Validators.required);
  East = new FormControl('180', Validators.required);


  select;
  per;
  chart;
  year;
  button;


  async ngOnInit() {

    console.log(this.choose_m_y.controls['m_y'].value)

    this.dataService.get_dataset().then(data => data.subscribe(
      res => {
        this.dataset_name = res
      })
    )

    this.dataService.get_dataset_rcp().then(data => data.subscribe(
      res => {
        this.dataset_name_rcp = res
      })
    )

    var dropdown = document.getElementsByClassName("dropdown-toggle");
    var i;
    console.log("dropdown", dropdown.length)

    var x = document.getElementById("menu1");
    var y = document.getElementById("menu2");
    var a = document.getElementById("raw");
    var b = document.getElementById("rcm");
    if (x.style.display === "none") {
      a.style.display = "block";
    } else {
      b.style.display = "none";
    }
    // $('#menu1').on('click', function () {

    // })
    for (i = 0; i < dropdown.length; i++) {
      dropdown[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
          dropdownContent.style.display = "none";
        } else {
          dropdownContent.style.display = "block";
        }
      });
    }

  }

  async get_indicesData() {
    this.plot_trend = false
    this.select = 'get_data'
    this.per = "no"
    var dataset = this.choosedataset.controls['rcp'].value
    var index = this.chooseindex.controls['indices'].value
    var rcp = this.chooseRCM.controls['rcp'].value
    var types = this.choose_m_y.controls['m_y'].value
    var startyear = this.selectrange.controls['startyear'].value
    var stopyear = this.selectrange.controls['stopyear'].value
    var startmonth = this.selectrange.controls['startmonth'].value + 1
    console.log("month", startmonth)
    var stopmonth = this.selectrange.controls['stopmonth'].value
    var region = [90, -90, -180, 180, 'rcp']
    if (startmonth == null || stopmonth == null) {
      startmonth = 1
      stopmonth = 1
    }

    await this.dataService.detail_rcp(dataset, index, this.choose_m_y.controls['m_y'].value).then(data => data.subscribe(
      res => {
        console.log("detail", res)
        var year = String(res.year).split("-")
        this.start_date = { year: Number(year[0]), month: 1, day: 1 }
        this.stop_date = { year: Number(year[1]), month: 11, day: 1 }
        var sent = [res, this.dataset_input, this.index_]
        this.inputservice.sendDetail(sent)
      }
    ))
    await this.inputservice.sendRegion(region)

    // var inputs = { 'dataset': dataset, 'index': index, 'startyear': startyear, 'stopyear': stopyear, 'startmonth': startmonth, 'stopmonth': stopmonth, 'plottrend': this.plot_trend,'rcp':rcp,'type':types }
    // await this.inputservice.sendInput(inputs)

    await this.dataService.get_lowres_rcp(dataset, index, startyear, stopyear, startmonth, stopmonth, rcp, types)
      .then(data => data.subscribe(
        (res => {
          // console.log("check dataaaaaa",res)
          let resp = JSON.parse(res)
          console.log("datarcp", resp)
          var inputs = { 'dataset': dataset, 'index': index, 'startyear': startyear, 'stopyear': stopyear, 'startmonth': startmonth, 'stopmonth': stopmonth, 'plottrend': this.plot_trend, 'rcp': rcp, 'type': types }
          var sent = { 'map': resp.low, 'input': inputs }
          // this.inputservice.sendLowRes(sent)
          this.inputservice.sendHiRes(resp.high)

          this.dataService.global_avg_rcp(dataset, index, startyear, startmonth, stopyear, stopmonth, rcp, types)
            .then(datas => datas.subscribe(res => {
              var data = Number(stopyear) - Number(startyear)
              console.log("dddddd", data)
              var start = Number(startyear)
              for (var i = 0; i <= data; i++) {
                Data.dataPoints.push(
                  { x: new Date(start, 0), y: res[0][i] },
                )
                start += 1
              }
              console.log("point", Data.dataPoints)
              this.chart = [Data.dataPoints, res[1], res[2], 'Golbal']
              var sent = { 'chart': this.chart, 'map': resp.low, 'input': inputs }
              this.inputservice.sendLowRes(sent)

            }))
        })
      ))

    await this.dataService.global_avg_rcp(dataset, index, startyear, startmonth, stopyear, stopmonth, rcp, types)
      .then(datas => datas.subscribe(res => {
        var data = Number(stopyear) - Number(startyear)
        console.log("dddddd", data)
        var start = Number(startyear)
        for (var i = 0; i <= data; i++) {
          Data.dataPoints.push(
            { x: new Date(start, 0), y: res[0][i] },
          )
          start += 1
        }
        console.log("point", Data.dataPoints)
        this.chart = [Data.dataPoints, res[1], res[2], 'Golbal']
        // var sent = { 'chart': this.chart,'input': inputs }
        this.inputservice.sendGraphAvg(this.chart)

      }))

    // await this.dataService.get_hire(this.dataset, index, startyear, stopyear, startmonth, stopmonth)
    //   .then(data => data.subscribe(
    //     (res => {
    //       // console.log("mpi",res)
    //       let resp = JSON.parse(res)
    //       console.log("datampi",resp)
    //       this.inputservice.sendHiRes(resp)
    //       // this.inputservice.sendHiRes(resp)
    //     })
    //   ))

    var Data = {
      dataPoints: []
    }

    // await this.dataService.nc_anomaly(index).then(data => data.subscribe(res => {
    //   console.log('ano', res)
    //   this.inputservice.sendanomaly(res)
    // }))
  }

  async get_raw_data() {
    this.plot_trend = false
    this.select = 'get_data'
    this.dataset = this.choosedataset.controls['raw'].value
    var rcp = this.chooseRCM.controls['rcp'].value
    console.log("get_data", rcp)
    var index = this.chooseindex.controls['index'].value
    var startyear = String(this.fromDate.year)
    var stopyear = String(this.toDate.year)
    var startmonth = String(this.fromDate.month)
    var stopmonth = String(this.toDate.month)
    // var region = [this.North.value, this.South.value, this.West.value, this.East.value]
    this.per = "no"
    console.log(this.dataset)

    await this.dataService.detail(this.dataset, index).then(data => data.subscribe(
      res => {
        console.log("detail", res)
        var year = String(res.year).split("-")
        this.start_date = { year: Number(year[0]), month: 1, day: 1 }
        this.stop_date = { year: Number(year[1]), month: 11, day: 1 }
        var sent = [res, this.dataset_input, this.index_]
        this.inputservice.sendDetail(sent)
      }
    ))


    var region = [this.North.value, this.South.value, this.West.value, this.East.value, 'raw']
    await this.inputservice.sendRegion(region)

    // var inputs = { 'dataset': this.dataset, 'index': index, 'startyear': startyear, 'stopyear': stopyear, 'startmonth': startmonth, 'stopmonth': stopmonth, 'plottrend': this.plot_trend }
    // await this.inputservice.sendInput(inputs)

    await this.dataService.get_lowres(this.dataset, index, startyear, stopyear, startmonth, stopmonth)
      .then(data => data.subscribe(
        (res => {
          // console.log("check dataaaaaa",res)
          let resp = JSON.parse(res)
          // console.log("datampi",resp)
          this.inputservice.sendHiRes(resp.high)
          var inputs = { 'dataset': this.dataset, 'index': index, 'startyear': startyear, 'stopyear': stopyear, 'startmonth': startmonth, 'stopmonth': stopmonth }
          this.dataService.global_avg(this.dataset, index, startyear, startmonth, stopyear, stopmonth)
            .then(datas => datas.subscribe(res => {
              var data = Number(stopyear) - Number(startyear)
              console.log("dddddd", data)
              var start = Number(startyear)
              for (var i = 0; i <= data; i++) {
                Data.dataPoints.push(
                  { x: new Date(start, 0), y: res[0][i] },
                )
                start += 1
              }
              console.log("point", Data.dataPoints)
              this.chart = [Data.dataPoints, res[1], res[2], 'Golbal']
              var sent = { 'chart': this.chart, 'map': resp.low, 'input': inputs }
              this.inputservice.sendLowRes(sent)

            }))
        })
      ))

    await this.dataService.global_avg(this.dataset, index, startyear, startmonth, stopyear, stopmonth)
      .then(datas => datas.subscribe(res => {
        var data = Number(stopyear) - Number(startyear)
        console.log("dddddd", data)
        var start = Number(startyear)
        for (var i = 0; i <= data; i++) {
          Data.dataPoints.push(
            { x: new Date(start, 0), y: res[0][i] },
          )
          start += 1
        }
        console.log("point", Data.dataPoints)
        this.chart = [Data.dataPoints, res[1], res[2], 'Golbal']
        // var sent = { 'chart': this.chart,'input': inputs }
        this.inputservice.sendGraphAvg(this.chart)

      }))

    var Data = {
      dataPoints: []
    }

    await this.dataService.nc_anomaly(index).then(data => data.subscribe(res => {
      console.log('ano', res)
      this.inputservice.sendanomaly(res)
    }))
  }

  async get_difference() {
    this.select = 'get_dif'
    var dataset = this.choosedataset.controls['raw'].value
    var index = this.chooseindex.controls['index'].value
    var rcp = 'None'
    var types = 'None'

    // await this.dataService.detail(dataset, index).then(data => data.subscribe(
    //   res => {
    //     console.log("detail", res)
    //     var year = String(res.year).split("-")
    //     this.start_date = { year: Number(year[0]), month: 1, day: 1 }
    //     this.stop_date = { year: Number(year[1]), month: 11, day: 1 }
    //     var sent = [res, dataset, index,rcp,types]
    //     this.inputservice.sendDetail(sent)
    //   }
    // ))

    var region = [this.North.value, this.South.value, this.West.value, this.East.value]
    await this.inputservice.sendRegion(region)
    var clear = 'clear'
    var sent = [{ 'dataset': dataset, 'index': index, 'rcp': rcp, 'types': types, 'clear': clear }]
    // var sent = [dataset, index, clear]
    this.inputservice.senddif(sent)
  }

  async getrcp_difference() {
    this.select = 'get_dif'
    var dataset = this.choosedataset.controls['rcp'].value
    var index = this.chooseindex.controls['indices'].value
    var rcp = this.chooseRCM.controls['rcp'].value
    var types = this.choose_m_y.controls['m_y'].value

    var region = [90, -90, -180, 180]
    await this.inputservice.sendRegion(region)

    // await this.dataService.detail_rcp(dataset, index, this.choose_m_y.controls['m_y'].value).then(data => data.subscribe(
    //   res => {
    //     console.log("detail", res)
    //     var year = String(res.year).split("-")
    //     this.start_date = { year: Number(year[0]), month: 1, day: 1 }
    //     this.stop_date = { year: Number(year[1]), month: 11, day: 1 }
    //     var sent = [res, dataset, index,rcp,types]
    //     this.inputservice.sendDetail(sent)
    //   }
    // ))
    var clear = 'clear'
    var sent = [{ 'dataset': dataset, 'index': index, 'rcp': rcp, 'types': types, 'clear': clear }]
    this.inputservice.senddif(sent)
  }
  async station_thai() {
    this.select = "station"
    var index = this.chooseindex.controls['index'].value
    var startyear = String(this.fromDate.year)
    var stopyear = String(this.toDate.year)
    var startmonth = String(this.fromDate.month)
    var stopmonth = String(this.toDate.month)
    await this.dataService.getdata_sta(index, startyear, stopyear, startmonth, stopmonth).then(res => {
      res.subscribe(datas => {
        this.inputservice.sendstation(datas)
      })

    })
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
    // console.log("vali", parsed)
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

}


