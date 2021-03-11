import { Component, OnInit } from '@angular/core';
import { TempService } from '../services/temp.service';
import * as CanvasJS from 'C:/Users/ice/Downloads/cli/canvasjs-3.0.5/canvasjs.min';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { map } from 'rxjs/operators';
import { Chart } from 'chart.js';
import { from, range } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-selectplot',
  templateUrl: './styles/selectplot.component.html',
  styleUrls: ['./styles/selectplot.component.css'],
  providers: [TempService]
})

export class SelectplotComponent implements OnInit {
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  public dataplot = [];
  public dataplotcsv = [];
  public stationyear;
  public startyear;
  public endyear;
  public startmonth;
  public endmonth;
  public startday;
  public endday;
  public stopyear;
  public stopmonth;
  public stationselected;

  constructor(private calendar: NgbCalendar, public formatter:NgbDateParserFormatter, private tempService: TempService) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    
  }
 
    public dataTemp;
    public dataMean;
    public dataMeanDB;
    public name = ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec'];
    station:Array<Object> = [
      {id: 300201, name: "แม่ฮ่องสอน"},{id: 300202, name: "แม่สะเรียง"},{id: 303201, name: "เชียงราย"},{id: 303301, name: "เชียงราย สกษ."},{id:310201 , name: "พะเยา"}, {id: 327202, name: "ดอยอ่างขาง"},
      {id: 327301, name: "แม่โจ้ สกษ."},{id: 327501, name: "เชียงใหม่"},{id: 328201, name: "ลำปาง"},{id: 328202, name: "เถิน"},{id: 328301, name: "ลำปาง สกษ."},{id: 329201, name: "ลำพูน"},
      {id: 330201, name: "แพร่"},{id: 331201, name: "น่าน"},{id: 331301, name: "น่าน สกษ."},{id: 331401, name: "ท่าวังผา"},{id: 331402, name: "ทุ่งช้าง"},{id: 351201, name: "อุตรดิตถ์"},
      {id: 352201, name: "หนองคาย"},{id: 353201, name: "เลย"},{id: 353301, name: "เลย สกษ."},{id: 354201, name: "อุดรธานี"},{id: 356201, name: "สกลนคร"},{id: 356301, name: "สกลนคร สกษ."},
      {id: 357201, name: "นครพนม"},{id: 357301, name: "นครพนม สกษ."},{id: 373201, name: "สุโขทัย"},{id: 373301, name: "ศรีสำโรง สกษ."},{id: 376201, name: "ตาก"}, 
      {id: 376202, name: "แม่สอด"},{id: 376203, name: "เขื่อนภูมิพล"},{id: 376301, name: "ดอยมูเซอร์ สกษ."},{id: 376401, name: "อุ้มผาง"},{id: 378201, name: "พิษณุโลก"},{id: 379201, name: "เพชรบูรณ์"}, 
      {id: 379401, name: "หล่มสัก"},{id: 379402, name: "วิเชียรบุรี"},{id: 380201, name: "กำแพงเพชร"},{id: 381201, name: "ขอนแก่น"},{id: 381301, name: "ท่าพระ สกษ."},{id: 383201, name: "มุกดาหาร"}, 
      {id: 386301, name: "พิจิตร สกษ."},{id: 387401, name: "มหาสารคาม"}, {id: 388401, name: "กาฬสินธุ์"},{id: 400201, name: "นครสวรรค์"},{id: 400301, name: "ตากฟ้า สกษ."},{id: 402301, name: "ชัยนาท สกษ."}, 
      {id: 403201, name: "ชัยภูมิ"},{id: 405201, name: "ร้อยเอ็ด"},{id: 405301, name: "ร้อยเอ็ด สกษ."},{id: 407301, name: "อุบลราชธานี สกษ."},{id: 407501, name: "อุบลราชธานี"},{id: 409301, name: "ศรีษะเกษ"}, 
      {id: 415301, name: "พระนครศรีอยุธยา"},{id: 419301, name: "ปทุมธานี สกษ."},{id: 423301, name: "ฉะเชิงเทรา"},{id: 424301, name: "ราชบุรี"},{id: 425201, name: "สุพรรณบุรี"},{id: 425301, name: "อู่ทอง สกษ."},
      {id: 426201, name: "ลพบุรี"},{id: 426401, name: "บัวชุม"},{id: 429201, name: "นำร่อง"},{id: 429601, name: "สนามบินสุวรรณภูมิ"},{id: 430201, name: "ปราจีนบุรี"},{id: 430401, name: "กบินทร์บุรี"},
      {id: 431201, name: "นครราชสีมา"},{id: 431301, name: "ปากช่อง สกษ."},{id: 431401, name: "โชคชัย"},{id: 432201, name: "สุรินทร์"},{id: 432301, name: "สุรินทร์ สกษ."},{id: 432401, name: "ท่าตูม"},
      {id: 436201, name: "บุรีรัมย์"},{id: 436401, name: "นางรอง"},{id: 440201, name: "สมุทรสงคราม"},{id: 440401, name: "อรัญประเทศ"},{id: 450201, name: "สระแก้ว"},{id: 450401, name: "ทองผาภูมิ"},
      {id: 451301, name: "นครปฐม"},{id: 455201, name: "กรุงเทพมหานคร"},{id: 455203, name: "ท่าเรือคลองเตย"},{id: 455301, name: "บางนา สกษ."},{id: 455302, name: "บางเขน สกษ."},{id: 455601, name: "สนามบินดอนเมือง"},
      {id: 459201, name: "ชลบุรี"},{id: 459202, name: "เกาะสีชัง"},{id: 459203, name: "พัทยา"},{id: 459204, name: "สัตหีบ"},{id: 459205, name: "แหลมฉบัง"},{id: 465201, name: "เพชรบุรี"},
      {id: 478201, name: "ระยอง"},{id: 478301, name: "ห้วยโป่ง สกษ."},{id: 480201, name: "จันทบุรี"},{id: 480301, name: "พลิ้ว สกษ."},{id: 500201, name: "ประจวบคีรีขันธ์"},{id: 500202, name: "หัวหิน"},
      {id: 500301, name: "หนองพลับ สกษ."},{id: 501201, name: "ตราด"},{id: 517201, name: "ชุมพร"},{id: 517301, name: "สวี สกษ."},{id: 532201, name: "ระนอง"},{id: 551203, name: "เกาะสมุย"},
      {id: 551301, name: "สุราษฏร์ธานี สกษ."},{id: 551401, name: "พระแสง สอท."},{id: 552201, name: "นครศรีธรรมราช"},{id: 552202, name: "ขนอม"},{id: 552301, name: "นครศรีธรรมราช สกษ."},{id: 552401, name: "ฉวาง"},
      {id: 560301, name: "พัทลุง สกษ."},{id: 561201, name: "ตะกั่วป่า"},{id: 564201, name: "ภูเก็ต"},{id: 564202, name: "ภูเก็ต(ศูนย์)"},{id: 566201, name: "เกาะลันตา"},{id: 566202, name: "กระบี่"},
      {id: 567201, name: "ตรัง"},{id: 568301, name: "คอหงษ์ สกษ."},{id: 568401, name: "สะเดา"},{id: 568501, name: "สงขลา"},{id: 568502, name: "หาดใหญ่"},{id: 570201, name: "สตูล"},
      {id: 580201, name: "ปัตตานี"},{id: 581301, name: "ยะลา สกษ."},{id: 583201, name: "นราธิวาส"}
  ];

    async ngOnInit() {

    }

    // async showcsv(){
    //   this.startyear = String(this.fromDate.year)
    //   this.startmonth = String(this.fromDate.month)
    //   this.stationyear = this.stationselected
    //   this.stopyear = String(this.toDate.year)
    //   this.stopmonth = String(this.toDate.month)
    //   await this.tempService.getrangecsv(this.stationyear,this.startyear,this.stopyear,this.startmonth,this.stopmonth).then(data => data.subscribe(
    //     res => { 
    //     this.dataplotcsv = [];
    //       this.dataplotcsv.push(res)
    //     }
    //   ))
    //   console.log("start: ",this.dataplotcsv,this.stationyear)
    // }
  
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

  getstation = new FormGroup({
    station: new FormControl('', Validators.required)
  });
  async getstationcode(){
    let s = this.getstation.value
    let select

    // GET STATION CODE
    for (let value of Object.values(s)) {
      select = value
      var splitted = select.split("-"); 
      this.stationselected = splitted[0];
    }
  }

  async submit(){
    let s = this.getstation.value
    let select
    let stationcode:any
    let plotdata = [];


    // GET STATION CODE
    for (let value of Object.values(s)) {
      select = value
      var splitted = select.split("-"); 
      stationcode = splitted[0];
    }
    this.dataMeanDB.map(v => {
      let a = Object.keys(v)
      for (var k of a){

        if (String(stationcode) == k ){
          for (var i in v[k]){
            plotdata.push(v[k][i])
          }
        }
      }
    })
    const lineChart = new Chart('lineChart', { 
      type: 'line', 
      data: { 
        labels:this.name,
        datasets: [
         // label: 'Number of items sold in months',
          { data: plotdata,
            label: 'Temperature',
            fill: false,
            lineTension: 0.3,
            borderColor: '#4E98B8', 
            borderWidth: 1
          },
      ]
      },
      options: {
        title: { 
          text: stationcode,
          display: true
        }
      },
      scales: { 
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  )}
}
