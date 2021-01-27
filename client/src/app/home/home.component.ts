import { Component, OnInit,ViewChild, AfterViewInit  } from '@angular/core';
import {FormGroup, FormControl,Validators} from '@angular/forms';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TempService } from 'src/app/services/temp.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[TempService]
  
})
export class HomeComponent implements OnInit {

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

  dataset_name:Array<Object> = [
    {id:'CRU', name:'CRU TS'},
    // {id:'station',name:'Stations in Thailand'}
  ];

  filename = [{id:'mean',name:'Temperature mean'},
               {id:'min',name:'Temperature min'},
               {id:'max',name:'Temperature max'},
               {id:'pre',name:'Preciptipation'}]

  constructor(private calendar: NgbCalendar,public formatter:NgbDateParserFormatter,private router: Router,private tempService: TempService) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
   }

  choosedataset = new FormGroup({
    set: new FormControl('', Validators.required)
  });

  choosefile = new FormGroup({
    file: new FormControl('', Validators.required)
  });

  select;
  // selectGrid;

  ngOnInit(): void {}

  Map(){
    console.log("start",this.fromDate.year)
    console.log("end",this.toDate.year)
    console.log("sent",this.choosefile.controls['file'].value)
    this.select = "Map"
    console.log(this.select)
  }

  grid(){
    this.select = "Grid"
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