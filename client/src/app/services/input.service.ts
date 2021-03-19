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

  private graphMean = new BehaviorSubject<any>(undefined);
  graphservice = this.graphMean.asObservable();
  async sendGraph(value:any){
    this.graphMean.next(value);
  }


  constructor(){}
  

}
