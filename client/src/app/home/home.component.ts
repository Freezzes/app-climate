import { Component, OnInit,ViewChild, AfterViewInit  } from '@angular/core';
import {FormGroup, FormControl,Validators} from '@angular/forms';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { Router ,ActivatedRoute} from '@angular/router';
import { TempService } from 'src/app/services/temp.service';
// import { RecieveDataService } from './data.service';
import * as $ from 'jquery';

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
  providers:[TempService]
  
})
export class HomeComponent implements OnInit {
  
  menuItems: any[];

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  public dataset;
  public file;
  public getdataset:any;
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

  public start_date;
  public stop_date;

  public checkmap = '';

  dataset_name:Array<Object> = [
    {id:'cru-ts', name:'CRU TS'},
    {id:'station', name:'TMD'},
    { id: 'ec-earth3', name: 'EC-Earth' },
    { id: 'cnrm-esm2-1', name: 'CNRM-ESM2-1' },
    { id: 'mpi-esm1-2-lr', name: 'MPI-ESM1-2-LR' }
  ];

  filename_cru = [{ id: 'tas', name: 'Averange Temperature' },
    { id: 'tasmin', name: 'Minimum Temperature' },
    { id: 'tasmax', name: 'Maximum Temperature' },
    { id: 'pr', name: 'Preciptipation' }
  ];

  filename_ec = [{ id: 'pr', name: 'Preciptipation' },
    { id: 'ps', name: 'surface pressure' },
    { id: 'ta', name: 'Air Temperature' },
    { id: 'tas', name: '2m Temperature' },
    { id: 'tasmin', name: 'daily min 2m Temperature' },
    { id: 'ua', name: 'eastward wind' },
    { id: 'va', name: 'northward wind' },
    { id: 'vas', name: '10V wind' }
  ];

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private calendar: NgbCalendar,
    public formatter:NgbDateParserFormatter,
    private tempService: TempService,
    // private recieveDataService: RecieveDataService
    ){
   }

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

  // public toggle = false;
  // public status = 'Enable'; 
  
  // enableDisableRule() {
  //   this.toggle = !this.toggle;
  //   this.status = this.toggle ? 'Enable' : 'Disable';
  //   console.log(this.status)
  // }

  ngOnInit(): void {
    // this.enableDisableRule()
    console.log("select",this.choosefile.controls['file'].value)
    console.log("select set: ",this.choosedataset.controls['set'].value)   
    $(document).ready(function () {

      $('#sidebarCollapse').on('click', function () {
          $('#sidebar').toggleClass('active');
      });  
  });

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
  }

  clearSelect(){
    this.select = "";
  }


  Map(){
    this.checkmap = ''
    let from_date = String(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day)
    let end_date = new Date(this.toDate.year, this.toDate.month, this.toDate.day)
    this.start_date = JSON.stringify(this.fromDate)
    this.stop_date = JSON.stringify(end_date)
    this.stop_date = this.stop_date.slice(1, 11)
    this.checkmap = 'check'
    this.select = "Map"
    this.per = "no"
    console.log(this.select)
  }

  station_thai(){
    console.log("start",this.fromDate.year)
    console.log("end",this.toDate.year)
    console.log("set",this.choosedataset.controls['set'].value)
    console.log("sent",this.choosefile.controls['file'].value)
    let from_date = new Date(this.fromDate.year,this.fromDate.month,this.fromDate.day)
    let end_date = new Date(this.toDate.year,this.toDate.month,this.toDate.day)
    let startyear = String(this.fromDate.year)
    let startmonth = String(this.fromDate.month)
    let startday = String(this.fromDate.day)
    let stopyear = String(this.toDate.year)
    let stopmonth = String(this.toDate.month)
    let stopday = String(this.toDate.day)
    if(startday.length == 1){
      startday = '0'+startday
    }
    if(startmonth.length == 1){
      startmonth = '0'+startmonth
    }
    this.start_date = String(startyear+'-'+startmonth+'-'+startday)
    if(stopday.length == 1){
      stopday = '0'+stopday
    }
    if(stopmonth.length == 1){
      stopmonth = '0'+stopmonth
    }
    this.stop_date = String(stopyear+'-'+stopmonth+'-'+stopday)
    console.log("f date : ",this.fromDate.year,this.fromDate.month,startday)
    console.log("begin : ", from_date,end_date)
    console.log("sent date : ", this.start_date,this.stop_date)
    this.select = "station"
  }

  percent(){
    this.select = "percent"
    this.per = "yes"
  }
  
  checktrue_values(){
    if (this.dataset){
      return false;
    }
    else{
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