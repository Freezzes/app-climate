import { Injectable } from '@angular/core'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { from, Observable } from 'rxjs'
import { Temp, Plot, meanplot, station5, st, Missing ,data_test, data_db,data_sta, grid} from '../interfaces/temp.interface'

@Injectable()

export class TempService {
    private API_URL = 'http://127.0.0.1:5500';
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

    async get_Avgcsv(ncfile:string,df_f:string,startyear:string,stopyear:string,startmonth:string,stopmonth:string):Promise<Observable<any>> {
        return this.http.get('http://127.0.0.1:5500' +
        `/nc_avg?ncfile=${ncfile}&df_f=${df_f}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}`);
    }

    async nc_defer(df_f:string,start1:string,stop1:string,start2:string,stop2:string):Promise<Observable<any>> {
        return this.http.get('http://127.0.0.1:5500' +
        `/nc_defer?df_f=${df_f}&start1=${start1}&stop1=${stop1}&start2=${start2}&stop2=${stop2}`);
    }

    async nc_per(df_f:string,start1:string,stop1:string,start2:string,stop2:string):Promise<Observable<any>> {
        return this.http.get('http://127.0.0.1:5500' +
        `/nc_per?df_f=${df_f}&start1=${start1}&stop1=${stop1}&start2=${start2}&stop2=${stop2}`);
    }

    getdata_test(): Observable<data_test[]>{
        console.log("service",this.http.get<data_test[]>('http://127.0.0.1:5500/api/getdata'))
        return this.http.get<data_test[]>('http://127.0.0.1:5500/api/getdata')

    }

    async getdata_sta(df_f:string,startyear:string,stopyear:string,startmonth:string,stopmonth:string): Promise<Observable<any>>{
        // console.log("service",this.http.get('http://127.0.0.1:5500/locat/station'))
        return this.http.get('http://127.0.0.1:5500'+ `/locat/station?df_f=${df_f}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}`)
    }

    // async get_grid_db(dataset:string): Promise<Observable<any>>{
    //     // console.log("service",this.http.get('http://127.0.0.1:5500/locat/station'))
    //     return this.http.get('http://127.0.0.1:5500'+ `/api/get_grid?dataset=${dataset}`)
    // }

    
    async get_grid_db(dataset:string): Promise<Observable<grid[]>>{
        console.log("service",this.http.get<grid[]>('http://127.0.0.1:5500'+ `/api/get_grid?dataset=${dataset}`))
        return this.http.get<grid[]>('http://127.0.0.1:5500'+ `/api/get_grid?dataset=${dataset}`)
    }

    async get_data_db(dataset:string,index:string,startyear:string,startmonth:string): Promise<Observable<any>>{
        // console.log("service",this.http.get('http://127.0.0.1:5500/locat/station'))
        return this.http.get('http://127.0.0.1:5500/' +`api/get_db?dataset=${dataset}&index=${index}&startyear=${startyear}&startmonth=${startmonth}`)
    }

    getdata_db(dataset:string,index:string,startyear:string,startmonth:string){
        const response = this.http.get('http://127.0.0.1:5500/api/get_db?dataset=TMD&index=pre&startyear=1903&startmonth=2',{responseType:"text"})
        
        // console.log("service_data", response)
        return response
        // return response.subscribe(
        //     async res => {
        //         // console.log("rerererer",JSON.stringify(res))
        //         return await JSON.parse(JSON.stringify(res)); 
        //     }
        // )
    }
}
