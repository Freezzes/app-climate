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

  dataset_name;
  index_name;

  public start_date;
  public stop_date;

  // filename_cru = [{ id: 'tas', name: 'Averange Temperature' },
  // { id: 'tasmin', name: 'Minimum Temperature' },
  // { id: 'tasmax', name: 'Maximum Temperature' },
  // { id: 'pr', name: 'Preciptipation' }
  // ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private tempService: TempService,
    private inputservice: InputService
  ) {}

  choosedataset = new FormGroup({
    set: new FormControl()
  });

  choosefile = new FormGroup({
    file: new FormControl()
  });

  North = new FormControl('90', Validators.required);
  South = new FormControl('-90', Validators.required);
  West = new FormControl('-180', Validators.required);
  East = new FormControl('180', Validators.required);

  select;
  per;
  selectGrid;
  chart;

  public anomaly_year
  public anomaly_name
  public anomalydata
  anomaly: any;
  public anomalyyear
  public fileanomaly

  // public anomaly_year = []
  // public anomaly_name = [];
  // public anomalydata = []
  // public anomaly = []
  // public anomalyyear = []
  // public fileanomaly = [];
  plot_trend;
  public Data;

  public value;
  public year;
  public name;

  async ngOnInit() {
    this.tempService.get_dataset().then(data => data.subscribe(
      res => {
        this.dataset_name = res
      }))

    this.tempService.get_index().then(data => data.subscribe(
      res => {
        this.index_name = res
      }))
  }

  // clearSelect() {
  //   this.select = "";
  // }

  
  async check_data(){
    this.dataset = this.choosedataset.controls['set'].value
    var index = this.choosefile.controls['file'].value
    var startyear = String(this.fromDate.year)
    var stopyear = String(this.toDate.year)
    await this.tempService.check_data(this.dataset,index,startyear,stopyear).then(data => data.subscribe(
      res => {
        let resp = JSON.parse(res)
        if (resp['check'] == 'no data'){
          this.errors(resp['year'])
        }
        else if(resp['check'] == 'have data'){
          this.get_raw_data()
        }
      }
    ))
  }

  async errors(year){
    this.select = 'NoData'
    this.year = year
  }  

  async get_difference() {
    this.select = 'get_dif'
    var data = this.choosedataset.controls['set'].value
    var index = this.choosefile.controls['file'].value
    var sent = [data, index]
    this.inputservice.senddif(sent)
    await this.tempService.detail(data, index).then(data => data.subscribe(
      res => {
        var detail = [res, data]
        this.inputservice.sendDetail(detail)
        // this.inputservice.sendDetail(res)
        console.log("dif result : ",res)
      }
    ))
  }

  async get_raw_data() {
    this.plot_trend = false
    this.select = 'get_data'
    this.dataset = this.choosedataset.controls['set'].value
    var index = this.choosefile.controls['file'].value
    var startyear = String(this.fromDate.year)
    var stopyear = String(this.toDate.year)
    var startmonth = String(this.fromDate.month)
    var stopmonth = String(this.toDate.month)
    // var region = [this.North.value, this.South.value, this.West.value, this.East.value]
    this.per = "no"

    var region = [this.North.value, this.South.value, this.West.value, this.East.value]
    await this.inputservice.sendRegion(region)

    var inputs = { 'dataset': this.dataset, 'index': index, 'startyear': startyear, 'stopyear': stopyear, 'startmonth': startmonth, 'stopmonth': stopmonth, 'plottrend': this.plot_trend }
    await this.inputservice.sendInput(inputs)

    await this.tempService.detail(this.dataset, index).then(data => data.subscribe(
      res => {
        var detail = [res, this.dataset]
        this.inputservice.sendDetail(detail)
      }
    )
    )

    await this.tempService.get_Avgcsvtrend(this.dataset, index, startyear, stopyear, startmonth, stopmonth)
      .then(data => data.subscribe(
        res => {
          console.log("trend result finish")
          let resp = JSON.parse(res)
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
          this.anomaly = [this.Data.dataPoints, this.anomaly_name, unit,'Global']
          // console.log("ano home :",send)      

          // this.inputservice.sendAnomaly(send)
        }))

    await this.tempService.get_Avgcsv(this.dataset, index, startyear, stopyear, startmonth, stopmonth)
      .then(data => data.subscribe(
        (res => {
          let resp = JSON.parse(res)
          this.inputservice.sendLowRes(resp)
        })
      ))

    await this.tempService.get_hire(this.dataset, index, startyear, stopyear, startmonth, stopmonth)
      .then(data => data.subscribe(
        (res => {
          let resp = JSON.parse(res)
          var inputs = { 'dataset': this.dataset, 'index': index, 'startyear': startyear, 'stopyear': stopyear, 'startmonth': startmonth, 'stopmonth': stopmonth }
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
              var sent = {'chart':this.chart,'map':resp,'input':inputs,'anomaly':this.anomaly}
              this.inputservice.sendHiRes(sent)
              console.log("hi graph",sent)
            })
            )
          // var sent = { 'chart': this.chart, 'map': resp, 'input': inputs, 'anomaly': this.anomaly }
          // this.inputservice.sendHiRes(sent)
        })
      ))

    // await this.tempService.global_avg(this.dataset, index, startyear,startmonth, stopyear, stopmonth)
    // .then(data => data.subscribe(res => {
    //   // console.log("global",res)
    //   var data = Number(stopyear)- Number(startyear)
    //   // console.log("dddddd",data)
    //   var start = Number(startyear)
    //   for (var i =0; i<= data; i++){
    //     Data.dataPoints.push(
    //       {x: new Date(start, 0), y: res[0][i]},        
    //     )
    //     start+=1
    //   }
    //   // console.log("point",Data.dataPoints)
    //   var sent = [Data.dataPoints,res[1],res[2]]
    //   // console.log("sent data from home ",sent)
    //   this.inputservice.sendGraph(sent)
    //   // this.plotMean(res[1],res[2])
    // }))






  }

  station_thai() {
    // console.log("start",this.fromDate.year)
    // console.log("end",this.toDate.year)
    // console.log("set",this.choosedataset.controls['set'].value)
    // console.log("sent",this.choosefile.controls['file'].value)
    let from_date = new Date(this.fromDate.year, this.fromDate.month, this.fromDate.day)
    let end_date = new Date(this.toDate.year, this.toDate.month, this.toDate.day)
    let startyear = String(this.fromDate.year)
    let startmonth = String(this.fromDate.month)
    let startday = String(this.fromDate.day)
    let stopyear = String(this.toDate.year)
    let stopmonth = String(this.toDate.month)
    let stopday = String(this.toDate.day)
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
    // console.log("f date : ",this.fromDate.year,this.fromDate.month,startday)
    // console.log("begin : ", from_date,end_date)
    // console.log("sent date : ", this.start_date,this.stop_date)
    this.select = "station"
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