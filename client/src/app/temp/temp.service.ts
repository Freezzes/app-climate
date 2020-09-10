import { Injectable } from '@angular/core'
import { HttpClient, HttpClientModule } from '@angular/common/http'

import { Observable } from 'rxjs'
import { Temp, Plot,meanplot } from './temp'

@Injectable()
export class TempsService {
    constructor(private http: HttpClient) { }

    getTemp(): Observable<Temp[]> {
        return this.http.get<Temp[]>('http://127.0.0.1:5500/api/tmean')
    }
    getmean(): Observable<Plot[]> {
        return this.http.get<Plot[]>('http://127.0.0.1:5500/api/plot')
    }
    getmeanDB(): Observable<meanplot[]> {
        return this.http.get<meanplot[]>('http://127.0.0.1:5500/api/meantem')
    }
}