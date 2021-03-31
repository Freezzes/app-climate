import { Injectable, Type } from '@angular/core';
import { Subject,BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})

export class InputService {

  private detail = new BehaviorSubject<any>(undefined);
  Detailservice=this.detail.asObservable();
  async sendDetail(value:any){
    this.detail.next(value);
  }

  private lowres = new BehaviorSubject<any>(undefined);
  lowresservice=this.lowres.asObservable();
  async sendLowRes(value:any){
    this.lowres.next(value);
  }

  private hires = new BehaviorSubject<any>(undefined);
  hiresservice=this.hires.asObservable();
  async sendHiRes(value:any){
    this.hires.next(value);
  }

  private region = new BehaviorSubject<any>(undefined);
  regionservice=this.region.asObservable();
  async sendRegion(value:any){
    this.region.next(value);
  }

  private dif = new BehaviorSubject<any>(undefined);
  difservice = this.dif.asObservable();
  async senddif(value:any){
    this.dif.next(value);
  }

  private country = new BehaviorSubject<any>(undefined);
  countryservice = this.country.asObservable();
  async sendcountry(value:any){
    this.country.next(value);
  }

  private input = new BehaviorSubject<any>(undefined);
  inputhomeservice = this.input.asObservable();
  async sendInput(value:any){
    this.input.next(value);
  }

  private continent = new BehaviorSubject<any>(undefined);
  continentservice = this.continent.asObservable();
  async sendcontinent(value:any){
    this.continent.next(value);
  }

  private graphAvg = new BehaviorSubject<any>(undefined);
  graphAvgservice = this.graphAvg.asObservable();
  async sendGraphAvg(value:any){
    this.graphAvg.next(value);
  }

  private graphcountryAvg = new BehaviorSubject<any>(undefined);
  graphcountryservice = this.graphcountryAvg.asObservable();
  async sendGraphcountry(value:any){
    this.graphcountryAvg.next(value);
  }

  constructor(){}
  

}
