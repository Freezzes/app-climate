import { Component, OnInit, resolveForwardRef } from '@angular/core';
import { TempService } from '../services/temp.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import * as Highcharts from 'highcharts';
import * as highheat from 'highcharts/modules/heatmap';
import { HighchartsChartComponent } from 'highcharts-angular';
import HighchartsMore from 'highcharts/highcharts-more';
import { FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {Config, Data, Layout} from 'plotly.js';
import { Chart,ChartData } from 'chart.js';
import * as CanvasJS from 'C:/Users/ice/Downloads//cli/canvasjs-3.0.5/canvasjs.min';
import Plotly from 'plotly.js-dist'
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as BoxLib from './lib/box.js';
import * as TestLib from './lib/testbox';
// import accordion from '@ng-bootstrap/ng-bootstrap/accordion/accordion';
// import * as $ from 'jquery';
@Component({
  selector: 'app-testfunction',
  templateUrl: './testfunction.component.html',
  styleUrls: ['./testfunction.component.css'],
  providers:[TempService]
})
export class TestfunctionComponent  implements OnInit{

  filename = [];
  public test;
  dataset_name;
  index_name;
  index;
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  hoveredDate2: NgbDate | null = null;
  fromDate2: NgbDate;
  toDate2: NgbDate | null = null;
  choosedataset = new FormGroup({
    set: new FormControl()
  });

  choosefile = new FormGroup({
    file: new FormControl()
  });

  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private tempService: TempService,
  ) { }
  ngOnInit(): void {
    console.log("select",this.choosefile.controls['file'].value)
    console.log("select set: ",this.choosedataset.controls['set'].value)   
    // $(document).ready(function () {

    //   $('#sidebarCollapse').on('click', function () {
    //       $('#sidebar').toggleClass('active');
    //   });  
  // });

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

    // this.tempService.get_index().then(data => data.subscribe(
    //   res => {
    //     this.index_name = res
    //   }))
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

  onDateSelection2(date2: NgbDate) {
    if (!this.fromDate2 && !this.toDate2) {
      this.fromDate2 = date2;
    } else if (this.fromDate2 && !this.toDate2 && date2.after(this.fromDate2)) {
      this.toDate2 = date2;
    } else {
      this.toDate2 = null;
      this.fromDate2 = date2;
    }
  }

  isHovered2(date2: NgbDate) {
    return this.fromDate2 && !this.toDate2 && this.hoveredDate2 && date2.after(this.fromDate2) && date2.before(this.hoveredDate2);
  }

  isInside2(date2: NgbDate) {
    return this.toDate2 && date2.after(this.fromDate2) && date2.before(this.toDate2);
  }

  isRange2(date2: NgbDate) {
    return date2.equals(this.fromDate2) || (this.toDate2 && date2.equals(this.toDate2)) || this.isInside2(date2) || this.isHovered2(date2);
  }

  validateInput2(currentValue2: NgbDate | null, input2: string): NgbDate | null {
    const parsed2 = this.formatter.parse(input2);
    return parsed2 && this.calendar.isValid(NgbDate.from(parsed2)) ? NgbDate.from(parsed2) : currentValue2;
  }

}