import { Injectable } from '@angular/core'
import { HttpClient, HttpClientModule } from '@angular/common/http'

import { Observable } from 'rxjs'
import { Temp, Plot } from './temp'

@Injectable()
export class TempsService {
    constructor(private http: HttpClient) { }

    getTemp(): Observable<Temp[]> {
        return this.http.get<Temp[]>('http://127.0.0.1:5500/api/tmean')
    }
    getpic(): Observable<Plot[]> {
        return this.http.get<Plot[]>('http://127.0.0.1:5500/api/plot')
    }
}