import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { TempService } from 'src/app/services/temp.service';
// import { RecieveDataService } from 'src/app/services/data.service';
import * as $ from 'jquery';
import { InputService } from "src/app/services/input.service";

declare interface RouteInfo {
  path: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/station', class: '' },
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [TempService]

})
export class HomeComponent implements OnInit {

  menuItems: any[];

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  public dataset;
  public file;
  public getdataset: any;
  public station;
  public startyear;
  public startmonth;
  public stopyear;
  public stopmonth;
  public lenght_y;
  public verb;
  infile = '';
  model: any;
  filename = [];
  public test;
  dataset_name;
  index_name;
  index;
  public start_date;
  public stop_date;
  North = new FormControl('85', Validators.required);
  South = new FormControl('-10', Validators.required);
  West = new FormControl('20', Validators.required);
  East = new FormControl('180', Validators.required);

  select;
  per;
  selectGrid;
  chart;
  indexrcp_name;

  public anomaly_year
  public anomaly_name
  public anomalydata
  anomaly: any;
  public anomalyyear
  public fileanomaly
  plot_trend;
  public Data;
  dataset_name_rcp;

  public value;
  public year;
  public name;

  public missdata = []
  public percentplot = []
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private tempService: TempService,
    private inputservice: InputService
  ) { }

  RCP = [
    { id: 'rcp45', name: 'RCP 4.5' },
    { id: 'rcp85', name: 'RCP 8.5' },
  ];

  M_Y = [
    { id: 'm', name: 'month' },
    { id: 'y', name: 'year' },
  ];
  
  month = ['Jan','Fab', 'Mach','April','May','June','July','Aug','Sep','Oct', 'Nov','Dec']

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
    this.tempService.get_index_rcp(newValue).then(data => data.subscribe(
      res => {
        this.indexrcp_name = res
      }
    ))

    if (newValue == 'm') {
      (document.getElementById("semonth") as any).disabled = false;
      (document.getElementById("semonth1") as any).disabled = false;
    }
    else {
      (document.getElementById("semonth") as any).disabled = true;
      (document.getElementById("semonth1") as any).disabled = true;
    }
  }
  async onChangeDataset(newValue) {
    this.dataset = newValue
    this.chooseindex.patchValue({
      file: null
    })

    if (newValue != 'tmd'){
      (document.getElementById("station") as any).disabled = true;
    }
    else{
      (document.getElementById("station") as any).disabled = false;
    }
    await this.tempService.detail(this.dataset, this.index).then(data => data.subscribe(
      res => {
        console.log("qqqqq",res.year)
        var year = String(res.year).split("-")
        this.start_date = {year: Number(year[0]), month: 1, day: 1}
        this.stop_date = {year: Number(year[1]), month: 11, day: 1}
        var detail = [res, this.dataset,this.index]
        this.inputservice.sendDetail(detail)
      }
    ))
    
    this.tempService.get_index(this.dataset).then(data => data.subscribe(
      res => {
        this.index_name = res
      }
    ))

  }

  async onChangeIndex(newvalue){
    console.log("index",this.dataset)
    this.index = newvalue
    await this.tempService.detail(this.dataset, this.index).then(data => data.subscribe(
      res => {
        console.log("qqqqq",res.year)
        var year = String(res.year).split("-")
        this.start_date = {year: Number(year[0]), month: 1, day: 1}
        this.stop_date = {year: Number(year[1]), month: 11, day: 1}
        var detail = [res, this.dataset,this.index]
        this.inputservice.sendDetail(detail)
      }
    ))

    await this.tempService.detail_rcp(this.dataset, newvalue, this.choose_m_y.controls['m_y'].value).then(data => data.subscribe(
      res => {
        console.log("detail", res)
        var year = String(res.year).split("-")
        this.start_date = { year: Number(year[0]), month: 1, day: 1 }
        this.stop_date = { year: Number(year[1]), month: 11, day: 1 }
        var sent = [res, this.dataset, this.index]
        this.inputservice.sendDetail(sent)
      }
    ))
  }


  // North = new FormControl('90', Validators.required);
  // South = new FormControl('-90', Validators.required);
  // West = new FormControl('-180', Validators.required);
  // East = new FormControl('180', Validators.required);
  

  // public anomaly_year = []
  // public anomaly_name = [];
  // public anomalydata = []
  // public anomaly = []
  // public anomalyyear = []
  // public fileanomaly = [];

  async ngOnInit() {
    var dropdown = document.getElementsByClassName("dropdown-toggle");
    var i;
  
    for (i = 0; i < dropdown.length; i++) {
      dropdown[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var dropdownContent = this.nextElementSibling;
      if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
      } else {
      dropdownContent.style.display = "block";
      }
      });
    }
    this.tempService.get_dataset().then(data => data.subscribe(
      res => {
        this.dataset_name = res
      }))

    this.tempService.get_dataset_rcp().then(data => data.subscribe(
      res => {
        this.dataset_name_rcp = res
      })
    )
  }

  // clearSelect() {
  //   this.select = "";
  // }


  // async check_data() {
  //   this.dataset = this.choosedataset.controls['set'].value
  //   var index = this.choosefile.controls['file'].value
  //   var startyear = String(this.fromDate.year)
  //   var stopyear = String(this.toDate.year)
  //   await this.tempService.check_data(this.dataset, index, startyear, stopyear).then(data => data.subscribe(
  //     res => {
  //       let resp = JSON.parse(res)
  //       if (resp['check'] == 'no data') {
  //         this.errors(resp['year'])
  //       }
  //       else if (resp['check'] == 'have data') {
  //         this.get_raw_data()
  //       }
  //     }
  //   ))
  // }

  // async errors(year) {
  //   this.select = 'NoData'
  //   this.year = year
  // }

  async get_difference() {
    this.select = 'get_dif'
    var dataset = this.choosedataset.controls['raw'].value
    var index = this.chooseindex.controls['index'].value
    var rcp ='None'
    var types = 'None'

    var region = [this.North.value, this.South.value, this.West.value, this.East.value]
    await this.inputservice.sendRegion(region)
    var clear = 'clear'
    var sent = [{'dataset':dataset,'index': index,'rcp':rcp,'types':types,'clear':clear}]
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
    var clear = 'clear'
    var sent = [{'dataset':dataset,'index': index,'rcp':rcp,'types':types,'clear':clear}]
    this.inputservice.senddif(sent)
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
    console.log("dataset",dataset)
    var stopmonth = this.selectrange.controls['stopmonth'].value
    var region = [90, -90, -180, 180, 'rcp']
    await this.inputservice.sendRegion(region)
    if (startmonth == null || stopmonth == null) {
      startmonth = 1
      stopmonth = 1
    }

    

    await this.tempService.get_lowres_rcp(dataset, index, startyear, stopyear, startmonth, stopmonth, rcp, types)
      .then(data => data.subscribe(
        (res => {
          // console.log("check dataaaaaa",res)
          let resp = JSON.parse(res)
          console.log("datarcp", resp)
          var inputs = { 'dataset': dataset, 'index': index, 'startyear': startyear, 'stopyear': stopyear, 'startmonth': startmonth, 'stopmonth': stopmonth, 'plottrend': this.plot_trend, 'rcp': rcp, 'type': types }
          var sent = { 'map': resp.low, 'input': inputs }
          // this.inputservice.sendLowRes(sent)
          this.inputservice.sendHiRes(resp.high)
          // var sent = { 'map': resp.low, 'input': inputs }
          // this.inputservice.sendLowRes(sent)
          this.tempService.global_avg_rcp(dataset, index, startyear, startmonth, stopyear, stopmonth, rcp, types)
            .then(datas => datas.subscribe(res => {
              var data = Number(stopyear) - Number(startyear)
              console.log("dddddd in", data)
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

          this.tempService.getanomaly_global_rcp(dataset, index, types, rcp).then(datas =>
            // datas.subscribe(res =>{
              console.log("rcp in data home res >>> ",datas)
            )
        })
      ))

    await this.tempService.getanomaly_global_rcp(dataset, index, types, rcp).then(datas =>
        datas.subscribe(res =>{
          console.log("rcp home res >>> ",res)
          this.anomalydata = res[0].anomaly
          this.anomaly_year = res[1].year
          this.anomaly_name = res[2].name
          var unit = res[3]
          this.Data = {
            dataPoints: []
          }
          for (var i = 0; i < this.anomalydata.length; i++) {
            if (this.anomalydata[i] > 0) {
              this.Data.dataPoints.push(
                { y: this.anomalydata[i], label: this.anomaly_year[i], color: 'red' }
              )
            }
            else if (this.anomalydata[i] < 0) {
              this.Data.dataPoints.push(
                { y: this.anomalydata[i], label: this.anomaly_year[i], color: 'blue' }
              )
            }
          }
          this.anomaly = [this.Data.dataPoints, this.anomaly_name, unit, 'Global']
          console.log("ano home :",this.anomaly)      

          this.inputservice.sendAnomaly(this.anomaly)
        }))
    await this.tempService.global_avg_rcp(dataset, index, startyear, startmonth, stopyear, stopmonth, rcp, types)
      .then(datas => datas.subscribe(res => {
        var data = Number(stopyear) - Number(startyear)
        console.log("dddddd out", data)
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
}

  async get_raw_data() {
    this.plot_trend = false
    this.select = 'get_data'
    this.dataset = this.choosedataset.controls['raw'].value
    var index = this.chooseindex.controls['index'].value
    var startyear = String(this.fromDate.year)
    var stopyear = String(this.toDate.year)
    var startmonth = String(this.fromDate.month)
    var stopmonth = String(this.toDate.month)
    // var region = [this.North.value, this.South.value, this.West.value, this.East.value]
    this.per = "no"

    var region = [this.North.value, this.South.value, this.West.value, this.East.value, 'raw']
    await this.inputservice.sendRegion(region)

    var inputs = { 'dataset': this.dataset, 'index': index, 'startyear': startyear, 'stopyear': stopyear, 'startmonth': startmonth, 'stopmonth': stopmonth, 'plottrend': this.plot_trend }
    await this.inputservice.sendInput(inputs)

    await this.tempService.get_Avgcsvtrend(this.dataset, index, startyear, stopyear, startmonth, stopmonth)
      .then(data => data.subscribe(
        res => {
          console.log("trend result finish")
          
          let resp = JSON.parse(res)
          console.log("sent trend",resp)
          this.inputservice.sendtrend(resp)
        }
      ))

    await this.tempService.getanomalync(this.dataset, index)
      .then(data => data.subscribe(
        res => {
          console.log("ano home res:", res)
          this.anomalydata = res[0].anomaly
          this.anomaly_year = res[1].year
          this.anomaly_name = res[2].name
          var unit = res[3]
          this.Data = {
            dataPoints: []
          }
          for (var i = 0; i < this.anomalydata.length; i++) {
            if (this.anomalydata[i] > 0) {
              this.Data.dataPoints.push(
                { y: this.anomalydata[i], label: this.anomaly_year[i], color: 'red' }
              )
            }
            else if (this.anomalydata[i] < 0) {
              this.Data.dataPoints.push(
                { y: this.anomalydata[i], label: this.anomaly_year[i], color: 'blue' }
              )
            }
          }
          this.anomaly = [this.Data.dataPoints, this.anomaly_name, unit, 'Global']
          // console.log("ano home :",send)      

          this.inputservice.sendAnomaly(this.anomaly)
        }))

    await this.tempService.get_Avgcsv(this.dataset, index, startyear, stopyear, startmonth, stopmonth)
      .then(data => data.subscribe(
        (res => {
          let resp = JSON.parse(res)
          // this.inputservice.sendLowRes(resp)
          this.inputservice.sendHiRes(resp.high)
          var inputs = { 'dataset': this.dataset, 'index': index, 'startyear': startyear, 'stopyear': stopyear, 'startmonth': startmonth, 'stopmonth': stopmonth }
          // var sent = { 'map': resp.low, 'input': inputs, 'anomaly': this.anomaly }
          // this.inputservice.sendLowRes(sent)
          this.tempService.global_avg(this.dataset, index, startyear, startmonth, stopyear, stopmonth)
            .then(data => data.subscribe(res => {
              var Data = {
                dataPoints: []
              }
              var data = Number(stopyear) - Number(startyear)
              var start = Number(startyear)
              for (var i = 0; i <= data; i++) {
                Data.dataPoints.push(
                  { x: new Date(start, 0), y: res[0][i] },
                )
                start += 1
              }
              console.log("point", Data.dataPoints)
              this.chart = [Data.dataPoints, res[1], res[2], 'Global']
              var sent = { 'chart': this.chart, 'map': resp.low, 'input': inputs, 'anomaly': this.anomaly }
              this.inputservice.sendLowRes(sent)
              // console.log("hi graph", sent)
            })
            )
        })
      ))

    // await this.tempService.get_hire(this.dataset, index, startyear, stopyear, startmonth, stopmonth)
    //   .then(data => data.subscribe(
    //     (res => {
    //       let resp = JSON.parse(res)
    //       var inputs = { 'dataset': this.dataset, 'index': index, 'startyear': startyear, 'stopyear': stopyear, 'startmonth': startmonth, 'stopmonth': stopmonth }
    //       this.tempService.global_avg(this.dataset, index, startyear, startmonth, stopyear, stopmonth)
    //         .then(data => data.subscribe(res => {
    //           var Data = {
    //             dataPoints: []
    //           }
    //           var data = Number(stopyear) - Number(startyear)
    //           var start = Number(startyear)
    //           for (var i = 0; i <= data; i++) {
    //             Data.dataPoints.push(
    //               { x: new Date(start, 0), y: res[0][i] },
    //             )
    //             start += 1
    //           }
    //           console.log("point", Data.dataPoints)
    //           this.chart = [Data.dataPoints, res[1], res[2], 'Global']
    //           var sent = { 'chart': this.chart, 'map': resp, 'input': inputs, 'anomaly': this.anomaly }
    //           this.inputservice.sendHiRes(sent)
    //           console.log("hi graph", sent)
    //         })
    //         )
    //       // var sent = { 'chart': this.chart, 'map': resp, 'input': inputs, 'anomaly': this.anomaly }
    //       // this.inputservice.sendHiRes(sent)
    //     })
    //   ))

  await this.tempService.global_avg(this.dataset, index, startyear, startmonth, stopyear, stopmonth)
    .then(data => data.subscribe(res => {
      var Data = {
        dataPoints: []
      }
      var data = Number(stopyear) - Number(startyear)
      var start = Number(startyear)
      for (var i = 0; i <= data; i++) {
        Data.dataPoints.push(
          { x: new Date(start, 0), y: res[0][i] },
        )
        start += 1
      }
      console.log("point", Data.dataPoints)
      this.chart = [Data.dataPoints, res[1], res[2], 'Global']
      // var sent = { 'chart': this.chart, 'map': resp, 'input': inputs, 'anomaly': this.anomaly }
      this.inputservice.sendGraphAvg(this.chart)
    }))
  }

  async station_thai() {
    this.select = "station"
    let from_date = new Date(this.fromDate.year, this.fromDate.month, this.fromDate.day)
    let end_date = new Date(this.toDate.year, this.toDate.month, this.toDate.day)
    let startyear = String(this.fromDate.year)
    let startmonth = String(this.fromDate.month)
    let startday = String(this.fromDate.day)
    let stopyear = String(this.toDate.year)
    let stopmonth = String(this.toDate.month)
    let stopday = String(this.toDate.day)
    this.dataset = this.choosedataset.controls['raw'].value
    var index = this.chooseindex.controls['index'].value
  
    if (startday.length == 1) {
      startday = '0' + startday
    }
    if (startmonth.length == 1) {
      startmonth = '0' + startmonth
    }
    this.start_date = String(startyear + '-' + startmonth + '-' + startday)
    if (stopday.length == 1) {
      stopday = '0' + stopday
    }
    if (stopmonth.length == 1) {
      stopmonth = '0' + stopmonth
    }
    this.stop_date = String(stopyear + '-' + stopmonth + '-' + stopday)

    await this.tempService.getdata_sta(index,String(this.start_date),String(this.stop_date)).then(res => {
      res.subscribe(datas => {
        console.log("send sta : ",datas)
        this.inputservice.sendstation(datas)
        // this.map = MapLib2.map_sta(datas)
      })
    })

    await this.tempService.getmissing(index).then(res =>{
      res.subscribe(datas => {
        this.missdata = [];
        this.missdata.push(datas)
        console.log("missdata home: ",this.missdata)
        this.missdata.map(u => { 
          let val = []
          const a = {}
          let count = 0
          u.map(v =>{
            for (let n in v.value){   
              if (String(v.value[n]) == String("-") ){
                 v.value = null
              }else{
                 v.value = v.value
           }
        }
        val.push(v.x,v.y,v.value)
        a[count] = val
        count += 1
        val = []
          })
          for (let i in a){
            this.percentplot.push(a[i])
         }
        })
        console.log("percent home plot >>>",this.percentplot)
        this.inputservice.sendMissedvalue(this.percentplot)
      })
    })
  }

  percent() {
    this.select = "percent"
    this.per = "yes"
  }

  checktrue_values() {
    if (this.dataset) {
      return false;
    }
    else {
      return true;
    }
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