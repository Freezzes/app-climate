import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { TempService } from 'src/app/services/temp.service';
import { RecieveDataService } from './data.service';
import * as $ from 'jquery'

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
  providers: [TempService, RecieveDataService]

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
  // public startyear;
  // public startmonth;
  // public stopyear;
  // public stopmonth;CRU
  public start_date;
  public stop_date;
  public lenght_y;
  public verb;
  infile = '';
  model: any;
  filename = [];

  dataset_name: Array<Object> = [
    { id: 'cru_ts', name: 'CRU TS' },
    { id: 'TMD', name: 'TMD' },
    { id: 'ec-earth3', name: 'EC-Earth' },
    { id: 'cnrm-esm2-1', name: 'CNRM-ESM2-1' },
    { id: 'mpi-esm1-2-lr', name: 'MPI-ESM1-2-LR' }
    // {id:'hadex', name:'Hadex2'}
  ];


  filename_cru = [{ id: 'tas', name: 'Averange Temperature' },
  { id: 'tasmin', name: 'Minimum Temperature' },
  { id: 'tasmax', name: 'Maximum Temperature' },
  { id: 'pr', name: 'Preciptipation' },
  //  {id:'CDD',name:'H2_CDD'},
  // { id: 'ec', name: 'Surface Air Temperature' }
]

  filename_ec = [{ id: 'pr', name: 'Preciptipation' },
  { id: 'ps', name: 'surface pressure' },
  { id: 'ta', name: 'Air Temperature' },
  { id: 'tas', name: '2m Temperature' },
  { id: 'tasmin', name: 'daily min 2m Temperature' },
  { id: 'ua', name: 'eastward wind' },
  { id: 'va', name: 'northward wind' },
  { id: 'vas', name: '10V wind' }]

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private tempService: TempService,
    private recieveDataService: RecieveDataService) {
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

  ngOnInit(): void {
    $(document).ready(function () {

      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
      });
    });

    var dropdown = document.getElementsByClassName("dropdown-toggle");
    var i;

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

  clearSelect() {
    this.select = "";
  }

  Map() {
    const data = {
      data:this.choosedataset.controls['set'].value,
      file:this.choosefile.controls['file'].value,
      startYear:this.fromDate.year,
      stopYear:this.toDate.year,
      startMonth:this.fromDate.month,
      stopMonth:this.toDate.month,
      North:this.North.value,
      South:this.South.value,
      West:this.West.value,
      East:this.East.value,
      per:"per",
    }

    this.recieveDataService.setData(data);
    // console.log("test test test", this.recieveDataService.data);
    // this.router.navigate(['/nc'], {state :this.choosedataset.value});
    let from_date = String(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day)
    let end_date = new Date(this.toDate.year, this.toDate.month, this.toDate.day)
    this.start_date = JSON.stringify(this.fromDate)
    // this.start_date = this.start_date.slice(1,11)
    this.stop_date = JSON.stringify(end_date)
    this.stop_date = this.stop_date.slice(1, 11)
    // console.log("start",this.fromDate)
    // console.log("end",this.toDate)
    // console.log("set",this.choosedataset.controls['set'].value)
    // console.log("sent",this.choosefile.controls['file'].value)
    this.select = "Map"
    this.per = "no"
    console.log(this.select)
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

