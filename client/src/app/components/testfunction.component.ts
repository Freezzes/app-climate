import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { TempService } from '../services/temp.service'


@Component({
  selector: 'app-testfunction',
  templateUrl: './styles/testfunction.component.html',
  styleUrls: ['./styles/testfunction.component.css'],
  providers:[TempService],
})
export class TestfunctionComponent implements OnInit  {

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  public dataplot = [];
  public dataplotcsv = [];
  public station;
  public startyear;
  public endyear;
  public startmonth;
  public endmonth;
  public startday;
  public endday;
  public stopyear;
  public stopmonth;

  constructor(private calendar: NgbCalendar, public formatter:NgbDateParserFormatter, private tempService: TempService) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    
  }
  async ngOnInit() {
  }
  async show(){
    this.startyear = String(this.fromDate.year)
    this.startmonth = String(this.fromDate.month)
    this.startday = String(this.fromDate.day)
    this.station = "300201";
    this.endyear = String(this.toDate.year)
    this.endmonth = String(this.toDate.month)
    this.endday = String(this.toDate.day)
    await this.tempService.getrangeyear(this.station,this.startyear,this.endyear,this.startmonth,this.endmonth,this.startday,this.endday).then(data => data.subscribe(
      res => { 
      this.dataplot = [];
        this.dataplot.push(res)
      }
    ))
    console.log("start: ",this.startyear,"endyear",this.endyear,"st",this.station,"data",this.dataplot[0])
  }

  async showcsv(){
    this.startyear = String(this.fromDate.year)
    this.startmonth = String(this.fromDate.month)
    this.station = "300201";
    this.stopyear = String(this.toDate.year)
    this.stopmonth = String(this.toDate.month)
    await this.tempService.getrangecsv(this.station,this.startyear,this.stopyear,this.startmonth,this.stopmonth).then(data => data.subscribe(
      res => { 
      this.dataplotcsv = [];
        this.dataplotcsv.push(res)
      }
    ))
    console.log("start: ",this.dataplotcsv)
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
