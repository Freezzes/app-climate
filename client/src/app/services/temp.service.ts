import { Injectable } from '@angular/core'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Temp, Plot, meanplot, station5, st } from '../interfaces/temp.interface'

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



}