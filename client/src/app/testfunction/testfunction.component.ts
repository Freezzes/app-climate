import { Component, OnInit } from '@angular/core';
import { TempService } from '../services/temp.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import * as Highcharts from 'highcharts';
import * as highheat from 'highcharts/modules/heatmap';
import { HighchartsChartComponent } from 'highcharts-angular';
import HighchartsMore from 'highcharts/highcharts-more';
import { FormControl, FormGroup, Validators} from '@angular/forms';

HighchartsMore(Highcharts);
@Component({
  selector: 'app-testfunction',
  templateUrl: './testfunction.component.html',
  styleUrls: ['./testfunction.component.css'],
  providers:[TempService]
})
export class TestfunctionComponent implements OnInit {

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  public dataplot = [];
  public calldata = [];
  public plotdata = []
  public testget = [];
  public test=[];
  public stationyear;
  public plotdate = [];
  public start_date;
  public end_date;
  public stationselected;
  public plotbox = [];
  public plotout = [];
  public plotname = [];
  public boxval = [];
  public outval = [];
  public nameval = [];
  check = "";
  dat:any;
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


  constructor(private calendar: NgbCalendar, public formatter:NgbDateParserFormatter, private tempService: TempService) {
    // this.fromDate = calendar.getToday();
    // this.toDate = calendar.getNext(calendar.getToday(), 'd', 20);
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
    // console.log(this.stationselected)
    this.dat = this.testdata1(this.stationselected)
    return this.dat
  }

  async testdata1(st){
    this.check = ''
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
    this.end_date = String(stopyear+'-'+stopmonth+'-'+stopday)
    this.stationyear = st
    this.plotbox = []
    this.plotname = []
    this.plotout = []
    this.boxval.length = 0;
    this.nameval.length = 0;
    this.outval.length = 0;
    await this.tempService.getboxplot(this.stationyear,this.start_date,this.end_date).then(data => data.subscribe(
      res => { 
        // console.log("res0 : ",res[0])
        // console.log("res1 : ",res[1])
        this.plotbox.push(res[0])
        this.plotname.push(res[1])
        this.plotout.push(res[2])
        // console.log("plot data : ",this.plotname)
      this.plotbox.map(v=>{
        for (let i in v){
          for (let j in v[i]){
            if(String(v[i][j]) == String('-')){
              v[i][j] = null
            }
          }
          this.boxval.push(v[i])
       }
        this.check = 'check';
      })
      
      this.plotname.map(v=>{
        for(let i of v){
          this.nameval.push(i)
        }
        this.check = 'check';
        // console.log("xname v month : ",this.nameval)
       })
       this.plotout.map(v=>{
         console.log("v : ",v)
         for (let i in v){
          console.log("v[i] : ",v[i])
          for (let j in v[i]){
            console.log("v[ij] : ",i,v[i][j])
            if(String(v[i][j]) == String('-')){
              v[i][j] = null
            }
            this.outval.push(v[i])
          }
          console.log("test get v : ",this.outval)
       }
      //  console.log("outliers : ", this.outval)
        this.check = 'check';
      })
    }))
    // console.log("box : ",this.boxval)  
    // console.log("name : ",this.nameval)
    console.log("out : ",this.outval)
    return this.boxval, this.outval
    // console.log('test get',this.test)

  }

  async testlink(){
   this.stationyear = '432301'
   this.start_date = '1980-10-01'
   this.end_date = '1981-02-31'
   await this.tempService.getboxplot(this.stationyear,this.start_date,this.end_date).then(data => data.subscribe(
      res => { 
        console.log("res0 : ", res[0])
        console.log("res1 : ", res[1])
        console.log("res1 : ", res[2])
        this.plotbox.push(res[0])
        this.plotname.push(res[1])
        this.plotout.push(res[2])
        this.plotbox.map(v=>{
         for (let i in v){
            for (let j in v[i]){
              if(String(v[i][j]) == String('-')){
                v[i][j] = null
              }
            }
            this.boxval.push(v[i])
         }
         console.log("plotbox : ", this.boxval)
          this.check = 'check';
        })
        this.plotname.map(v=>{
         for(let i of v){
           this.nameval.push(i)
         }
         this.check = 'check';
         console.log("xname v month : ",this.nameval)
        })
        this.plotout.map(v=>{
          for (let i in v){
           for (let j in v[i]){
             if(String(v[i][j]) == String('-')){
               v[i][j] = null
             }
           }
           this.outval.push(v[i])
        }
        console.log("outliers : ", this.outval)
         this.check = 'check';
       })


      }))

    return this.boxval

  }
  async ngOnInit() {      
    }

    
    highcharts = Highcharts;
    chartOptions = {   
        chart : {
          type: 'boxplot',
          marginTop: 40,
          marginBottom: 100,
  
        },

      title: {
          text: 'Box Plot'
      },
  
      legend: {
          enabled: false
      },
  
      xAxis: {
          categories: this.nameval,
          title: {
              text: 'Month No.'
          }
      },
  
      yAxis: {
          title: {
              text: 'Observations'
          },
          // plotLines: [{
          //     value: 932,
          //     color: 'red',
          //     width: 1,
          //     label: {
          //         text: 'Theoretical mean: 932',
          //         align: 'center',
          //         style: {
          //             color: 'gray'
          //         }
          //     }
          // }]
      },
      
      series: [{
          name: 'Observations',
          data: this.boxval,
          tooltip: {
              headerFormat: '<em>Month No {point.key}</em><br/>'
          }
      }, {
          name: 'Outliers',
          color: Highcharts.getOptions().colors[0],
          type: 'scatter',
          data: 
          this.outval
          ,
          marker: {
              fillColor: 'white',
              lineWidth: 1,
              lineColor: Highcharts.getOptions().colors[0]
          },
          tooltip: {
              pointFormat: 'Observation: {point.y}'
          }
      }]
      
  };
  

}
