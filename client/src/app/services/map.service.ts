// import { Injectable } from '@angular/core'
// import { HttpClient, HttpClientModule } from '@angular/common/http'

// import { Observable } from 'rxjs'
// import { Temp, Plot,Position } from './temp'
// import { Router } from '@angular/router'

// @Injectable()
// export class TempsService {
//     constructor(private http: HttpClient) { }

//     getTemp(): Observable<Temp[]> {
//         return this.http.get<Temp[]>('http://127.0.0.1:5500/api/tmean')
//     }
//     getpic(): Observable<Plot[]> {
//         return this.http.get<Plot[]>('http://127.0.0.1:5500/api/plot')
//     }
//     getlatlon(): Observable<Position[]>{
//         return this.http.get<Position[]>('http://127.0.0.1:5500/api/testcode')
//     }
// }