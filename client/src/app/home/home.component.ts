import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import * as $ from 'jquery'
import { InputService } from "src/app/services/input.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DataService]

})
export class HomeComponent implements OnInit {
  menuItems: any[];

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;
  public dataset;
  public file;
  public getdataset: any;
  public station;
  public start_date;
  public stop_date;
  public lenght_y;
  public verb;
  infile = '';
  model: any;
  filename = [];

  dataset_name;

  // dataset_name: Array<Object> = [
  //   { id: 'cru_ts', name: 'CRU TS' },
  //   { id: 'TMD', name: 'TMD' },
  //   { id: 'ec-earth3', name: 'EC-Earth' },
  //   { id: 'cnrm-esm2-1', name: 'CNRM-ESM2-1' },
  //   { id: 'mpi-esm1-2-lr', name: 'MPI-ESM1-2-LR' }
  // ];

  filename_cru = [{ id: 'tas', name: 'Averange Temperature' },
  { id: 'tasmin', name: 'Minimum Temperature' },
  { id: 'tasmax', name: 'Maximum Temperature' },
  { id: 'pr', name: 'Preciptipation' },
  ]

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private dataService: DataService,
    private inputservice: InputService) {
    // this.fromDate = calendar.getToday();
    // this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  choosedataset = new FormGroup({
    set: new FormControl()
  });

  choosefile = new FormGroup({
    file: new FormControl(),
  });

  North = new FormControl('90', Validators.required);
  South = new FormControl('-90', Validators.required);
  West = new FormControl('-180', Validators.required);
  East = new FormControl('180', Validators.required);


  select;
  per;
  // selectGrid;

  async ngOnInit(){
    this.dataService.get_dataset().then(data => data.subscribe(
      res => {
        this.dataset_name = res
      }))

    var region = [this.North.value, this.South.value, this.West.value, this.East.value]
    await this.inputservice.sendRegion(region)
  }

  clearSelect() {
    this.select = "";
  }

  async get_raw_data() {
    this.select = 'get_data'
    console.log("get_data")
    this.dataset = this.choosedataset.controls['set'].value
    var index = this.choosefile.controls['file'].value
    var startyear = String(this.fromDate.year)
    var stopyear = String(this.toDate.year)
    var startmonth = String(this.fromDate.month)
    var stopmonth = String(this.toDate.month)
    // var region = [this.North.value, this.South.value, this.West.value, this.East.value]
    this.per = "no"
    console.log(this.dataset)

    await this.dataService.detail(this.dataset, index).then(data => data.subscribe(
      res => {
        var detail = [res,this.dataset]
        this.inputservice.sendDetail(detail)
        console.log("detailllllll",this.dataset)
      }
    )
    )

    // await this.inputservice.sendRegion(region)

    await this.dataService.get_Avgcsv(this.dataset, index, startyear, stopyear, startmonth, stopmonth)
      .then(data => data.subscribe(
        (res => {
          let resp = JSON.parse(res)
          this.inputservice.sendLowRes(resp)
        })
      ))

    await this.dataService.get_hire(this.dataset, index, startyear, stopyear, startmonth, stopmonth)
      .then(data => data.subscribe(
        (res => {
          let resp = JSON.parse(res)
          this.inputservice.sendHiRes(resp)
        })
      ))

    await this.dataService.global_avg(this.dataset, index, startyear,startmonth, stopyear, stopmonth)
    .then(data => data.subscribe(res => {
      console.log("global",res)
      var data = Number(stopyear)- Number(startyear)
      console.log("dddddd",data)
      var start = Number(startyear)
      for (var i =0; i<= data; i++){
        Data.dataPoints.push(
          {x: new Date(start, 0), y: res[0][i]},        
        )
        start+=1
      }
      console.log("point",Data.dataPoints)
      var sent = [Data.dataPoints,res[1],res[2]]
      this.inputservice.sendGraph(sent)
      // this.plotMean(res[1],res[2])
    }))

    var Data = {
      // value:[],
      dataPoints : []
    }
    
    
  }

  async get_difference(){
    this.select = 'get_dif'
    var data = this.choosedataset.controls['set'].value
    var index = this.choosefile.controls['file'].value
    var sent = [data,index]
    this.inputservice.senddif(sent)

  }

  station_thai() {
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
    console.log("vali", parsed)
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
}

