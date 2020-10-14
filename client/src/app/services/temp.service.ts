import { Injectable } from '@angular/core'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Temp, Plot, meanplot,varmonth, NC } from '../interfaces/temp.interface'

interface resp{
    data: []
}

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

    async getVarMonth(): Promise<varmonth[]> {
        let result = [];
        this.http.get<meanplot[]>('http://127.0.0.1:5500/api/month')
            .subscribe(res => {
                result.push(res);
            })
        return result;
    }

    async filterData(station:string,month:number,year:number): Promise<any>{
        var result;
        result = this.http.post<resp>(`http://127.0.0.1:5500/filterData?station=${station}&month=${month}&year=${year}`,null)
        .subscribe(res => { 
            return res.data
        })
        
        console.log("!!!!!!!!!!!!!!",result)
        return result;
    }

    async getrangecsv(startyear:string,stopyear:string,startmonth:string,stopmonth:string):Promise<Observable<any>> {   
        return this.http.get('http://127.0.0.1:5500/api' +
                         `/rangecsv?startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}`)
                         
    }

    async get_nc(): Promise<Plot[]> {
        let result = [];
        this.http.get<NC[]>('http://127.0.0.1:5500/netcdf')
            .subscribe(res => {
                result.push(res);
            })
        console.log('result in get_nc',result)
        return result;

    }

    getnc():Observable<NC[]> {
        return this.http.get<NC[]>('http://127.0.0.1:5500/test');
    }
}