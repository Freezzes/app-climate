import { Component, OnInit } from '@angular/core';
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

highheat(Highcharts);
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

  public test=[];
  public stationyear;
  public start_date;
  public end_date;
  public stationselected;
  public plotbox = [];
  public plotout = [];
  public plotname = [];
  public boxval = [];
  public outval = [];
  public nameval = [];
  checkbox = "";
  checkmiss = "";
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
  yearList = [1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,
    1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,
    2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018]

  filename = [{id:'mean',name:'Temperature mean'},
    {id:'min',name:'Temperature min'},
    {id:'max',name:'Temperature max'},
    {id:'pre',name:'Preciptipation'}]

  myForm:FormGroup;
  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  cities = [];
  selectedItems = [];
  dropdownSettings: any = {};
  public dataplotcsv = [];
  public TempData;
  public startyear;
  public stopyear;
  public startmonth;
  public stopmonth;
  public stationmiss;
  public missdata = [];
  public missingval = [];
  public percent = [];
  public percentplot = [];
  public d = [];
  public dfile = [];
  public selectstation = [];
  public selectstationid = [];
 

  constructor(private calendar: NgbCalendar, public formatter:NgbDateParserFormatter, private tempService: TempService, private fb: FormBuilder) {
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
    this.checkbox = ''
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
      this.plotbox.map(v=>{
        for (let i in v){
          for (let j in v[i]){
            if(String(v[i][j]) == String('-')){
              v[i][j] = null
            }
          }
          this.boxval.push(v[i])
       }
        this.checkbox = 'check';
      })
      
      this.plotname.map(v=>{
        for(let i of v){
          this.nameval.push(i)
        }
        this.checkbox = 'check';
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
        this.checkbox = 'check';
      })
    }))
    console.log("out : ",this.outval)
    return this.boxval
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
          this.checkbox = 'check';
        })
        this.plotname.map(v=>{
         for(let i of v){
           this.nameval.push(i)
         }
         this.checkbox = 'check';
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
         this.checkbox = 'check';
       })


      }))

    return this.boxval

  }
  async ngOnInit() {    
    this.missingval = await this.tempService.getMissed();
    this.selectedItems = [];
    this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 10,
        allowSearchFilter: this.ShowFilter
    };
    this.myForm = this.fb.group({
        city: [this.selectedItems]
    });
    
    }
    onItemSelect(item: any) {
      //  this.selectstationid = []
      console.log('!!!onItemSelect', item);
  }
    onSelectAll(items: any) {
      console.log('onSelectAll', items);
  }
    toogleShowFilter() {
      this.ShowFilter = !this.ShowFilter;
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
  }

    handleLimitSelection() {
      if (this.limitSelection) {
          this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
      } else {
          this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
      }
  }
    choosefile = new FormGroup({
      file: new FormControl('', Validators.required)
    });
  
      sstartyear = new FormGroup({
      syear: new FormControl('', Validators.required)
    });
      eendyear = new FormGroup({
      eyear: new FormControl('', Validators.required)
    });
    async selectmiss(){
      this.checkmiss = ''
      this.selectstationid = [];
      const selectValueList = this.myForm.get("city").value;
      selectValueList.map( item => {
         this.selectstationid.push(item.id);
      });
      console.log("station id: ", this.selectstationid)
      let fi = this.choosefile.value
      let fil = ''
      for (let v of Object.values(fi)){
         if(String(v) == String('Temperature mean')){
            fil = 'mean'
         }
         if(String(v) == String('Temperature min')){
            fil = 'min'
         }
         if(String(v) == String('Temperature max')){
            fil = 'max'
         }
         if(String(v) == String('Preciptipation')){
            fil = 'pre'
         }
         console.log("key",fil)
      }
      let syy = this.sstartyear.value
      let styear
      this.stationmiss = this.selectstationid
      for(let v of Object.values(syy)){
         styear = v
      }
      this.startyear = Number(styear)
      let eey = this.eendyear.value
      let enyear 
      for(let v of Object.values(eey)){
         enyear = v
      }
      this.stopyear = Number(enyear)
      console.log("start year : ", this.startyear)
      let per=[];
      this.percentplot.length = 0
      await this.tempService.getmissing(this.stationmiss,this.startyear,this.stopyear,fil).then(data => data.subscribe(
        res => { 
        this.missdata = [];
          this.missdata.push(res)
         //  console.log("missdata : ",this.missdata)
        this.missdata.map(u => { 
         //   console.log("select u",u)
           let val = []
           const a = {}
           let count = 0
           u.map(v =>{
              // console.log("select v",typeof(v))
              for (let n in v.value){   
               //   console.log("miss value",v.value,v.x,v.y)
               //   console.log("miss type",typeof(v.value),typeof(v.x),typeof(v.y))
                 if (String(v.value[n]) == String("-") ){
                    v.value = null
                 }else{
                    v.value = v.value
              }
           }
         //   console.log("miss value",v.value,v.x,v.y)
              val.push(v.x,v.y,v.value)
               a[count] = val
               count += 1
               val = []
               // console.log("miss val",a)
           })
   
           for (let i in a){
             this.percentplot.push(a[i])
          }
          console.log("miss per : ",this.percentplot)
          console.log("p",typeof(this.percentplot))
           val = []
        })
       this.checkmiss = 'check';
     }))
    
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
              fillColor: 'blue',
              lineWidth: 1,
              lineColor: Highcharts.getOptions().colors[0]
          },
          tooltip: {
              pointFormat: 'Observation: {point.y}'
          }
      }]
      
  };

  highcharts1 = Highcharts;
  chartOptions1 = {   
     chart : {
        type: 'heatmap',
        marginTop: 40,
        marginBottom: 80,

     },
     title : {
        text: 'Missing Value'   
     },
     xAxis : {
        categories: [300201,300202,303201,303301,310201,327202,327301,327501,328201,328202, 328301, 329201, 
         330201,331201, 331301, 331401, 331402, 351201,352201, 353201, 353301, 354201, 356201, 356301,357201, 
         357301, 373201, 373301, 376201, 376202, 376203, 376301, 376401, 378201, 379201,379401, 379402, 380201, 
         381201, 381301, 383201, 386301, 387401, 388401, 400201, 400301, 402301,403201, 405201,405301, 407301, 
         407501, 409301,415301, 419301, 423301, 424301, 425201,425301,426201, 426401, 429201,429601, 430201,430401,
         431201, 431301, 431401,432201, 432301, 432401, 436201, 436401, 440201, 440401, 450201,450401,451301, 
         455201, 455203, 455301, 455302, 455601,459201, 459202, 459203, 459204, 459205, 465201,478201, 478301, 
         480201, 480301, 500201, 500202,500301, 501201, 517201, 517301, 532201, 551203, 551301, 551401, 552201, 
         552202, 552301, 552401,560301, 561201, 564201, 564202, 566201,566202,567201, 568301, 568401, 568501, 568502, 
         570201, 580201, 581301, 583201],
         labels: {
           rotation: -90,
          step:1,
           style: {
               fontSize:'7px'
            }
        }
     },
     yAxis : {
        categories: [1951,1952,1953,1954,1955,1956,1957,1958,1959,1960,1961,1962,1963,1964,1965,1966,1967,1968,1969,1970,1971,1972,1973,1974,
         1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,
         2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015],
           title: null
     },
     colorAxis : {
        min: 0,
        max:100,
        minColor: '#0661CC',
        maxColor: '#FFFFFF'
     },
     legend : {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        // color: '#ffffff',
        y: 25,
        symbolHeight: 280
     },
     tooltip : {
        formatter: function () {
           return '<b>' + '</b> missing <br><b>' +
              this.point.value +'</b> % <br><b>' 

        }
     },
     series : [{
        name: 'missing',
        borderWidth: 1,
        turboThreshold:0,
        borderColor:'#FFFFFF',
        nullColor:'#000000',
        data: this.percentplot,       
        dataLabels: {
           enabled: false,
           color: '#000000'
        }
     }]
    
   };
  

}
