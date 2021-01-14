import { Injectable } from '@angular/core'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Temp, Plot, meanplot, station5, st, Missing } from '../interfaces/temp.interface'

@Injectable()
export class TempService {
    constructor(private http: HttpClient) { }

    async getTemp(): Promise<Temp[]> {
        let result = [];
        this.http.get<Temp[]>('http://127.0.0.1:5500/api/tmean')
            .subscribe(res => {
                result.push(res);
            })
        return result;
    }

    async getMean(): Promise<Plot[]> {
        let result = [];
        this.http.get<Plot[]>('http://127.0.0.1:5500/api/plot')
            .subscribe(res => {
                result.push(res);
            })
        return result;
    }

    async getMeanDB(): Promise<meanplot[]> {
        let result = [];
        this.http.get<meanplot[]>('http://127.0.0.1:5500/api/meantem')
            .subscribe(res => {
                result.push(res);
            })
        return result;
    }

    async getrain(): Promise<station5[]> {
        let result = [];
        this.http.get<station5[]>('http://127.0.0.1:5500/api/rain')
            .subscribe(res => {
                result.push(res);
            })
        return result;
    }

    async getstation(): Promise<st[]> {
        let result = [];
        this.http.get<st[]>('http://127.0.0.1:5500/api/station')
            .subscribe(res => {
                result.push(res);
            })
        return result;
    }

    async getrangeyear(station:string,startyear:string,endyear:string,startmonth:string,endmonth:string,startday:string,endday:string):Promise<Observable<any>> {   
        return this.http.get('http://127.0.0.1:5500/api' +
                         `/rangeyear?station=${station}&startyear=${startyear}&endyear=${endyear}&startmonth=${startmonth}&endmonth=${endmonth}&startday=${startday}&endday=${endday}`)
                         
    }

    async getrangecsv(station:string,startyear:string,stopyear:string,startmonth:string,stopmonth:string):Promise<Observable<any>> {   
        return this.http.get('http://127.0.0.1:5500/api' +
                         `/rangecsv?station=${station}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}`)
                         
    }

    async getboxvalue(station:string,start_date:string,end_date:string):Promise<Observable<any>>{
        return this.http.get('http://127.0.0.1:5500/api'+
                        `/boxplotvalue?station=${station}&start_date=${start_date}&end_date=${end_date}`)
    }

    async getMissed(): Promise<Missing[]> {
        let result = [];
        this.http.get<Missing[]>('http://127.0.0.1:5500/api/missing')
            .subscribe(res => {
                result.push(res);
            })
        return result;
    }
    async getmissing(sta:string,startyear:string,stopyear:string,dff:string):Promise<Observable<any>>{
        return this.http.get('http://127.0.0.1:5500/api'+
                        `/selectmissing?sta=${sta}&startyear=${startyear}&stopyear=${stopyear}&dff=${dff}`
        )}

    getData(){
        return this.http.get('http://127.0.0.1:5500/api/missing')
    }

    async get_testnc_csv(df_f:string,startyear:string,stopyear:string,startmonth:string,stopmonth:string):Promise<Observable<any>> {
        return this.http.get('http://127.0.0.1:5500' +
        `/nc_csv?df_f=${df_f}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}`);
    }

    async get_Avgcsv(df_f:string,startyear:string,stopyear:string,startmonth:string,stopmonth:string):Promise<Observable<any>> {
        return this.http.get('http://127.0.0.1:5500' +
        `/nc_Avg?df_f=${df_f}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}`);
    }



}