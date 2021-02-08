import { Component, OnInit,ViewChild, AfterViewInit  } from '@angular/core';
import {FormGroup, FormControl,Validators} from '@angular/forms';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { Router ,ActivatedRoute} from '@angular/router';
import { TempService } from 'src/app/services/temp.service';
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

  dataset_name:Array<Object> = [
    {id:'CRU', name:'CRU TS'},
    {id:'station',name:'Stations in Thailand'},
    {id:'TMD', name:'TMD'},
    {id:'EC', name:'EC-Earth'},
  ];

  filename = [{id:'mean',name:' Average Temperature'},
    {id:'min',name:'Minimum Temperature'},
    {id:'max',name:'Maximum Temperature'},
    {id:'pre',name:'Preciptipation'},
    {id:'ec', name:'Surface Air Temperature'}]
  constructor(private router: Router, private route: ActivatedRoute,private calendar: NgbCalendar,public formatter:NgbDateParserFormatter,private tempService: TempService) {
   }

  choosedataset = new FormGroup({
    set: new FormControl()
  });

  choosefile = new FormGroup({
    file: new FormControl()
  });

  select;
  per;
  // selectGrid;

  ngOnInit(): void {
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
    console.log("start",this.fromDate.year)
    console.log("end",this.toDate.year)
    console.log("set",this.choosedataset.controls['set'].value)
    console.log("sent",this.choosefile.controls['file'].value)
    this.select = "Map"
    this.per = "no"
    console.log(this.select)
  }

  station_thai(){
    console.log("start",this.fromDate.year)
    console.log("end",this.toDate.year)
    console.log("set",this.choosedataset.controls['set'].value)
    console.log("sent",this.choosefile.controls['file'].value)
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