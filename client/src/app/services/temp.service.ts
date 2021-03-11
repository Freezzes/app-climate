import { Injectable } from '@angular/core'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { from, Observable } from 'rxjs'
import { Temp, Plot, meanplot, station5, st, Missing ,data_test, data_db,data_sta, grid} from '../interfaces/temp.interface'

@Injectable()

export class TempService {
    private API_URL = 'http://127.0.0.1:5500';
    constructor(private http: HttpClient) { }

    async getdata_sta(df_f:string,startyear:string,stopyear:string,startmonth:string,stopmonth:string): Promise<Observable<any>>{
        // console.log("service",this.http.get('http://127.0.0.1:5500/locat/station'))
        return this.http.get('http://127.0.0.1:5500'+ `/locat/station?df_f=${df_f}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}`)
    }

    async get_grid_db(dataset:string): Promise<Observable<any>>{
        // console.log("service",this.http.get('http://127.0.0.1:5500/locat/station'))
        return this.http.get('http://127.0.0.1:5500'+ `/api/get_grid?dataset=${dataset}`)
    }

    getdata_db(dataset:string,index:string,startyear:string,startmonth:string){
        const response = this.http.get('http://127.0.0.1:5500/'+`api/get_db?dataset=${dataset}&index=${index}&startyear=${startyear}&startmonth=${startmonth}`,{responseType:"text"})
        
        // console.log("service_data", response)
        return response
        // return response.subscribe(
        //     async res => {
        //         // console.log("rerererer",JSON.stringify(res))
        //         return await JSON.parse(JSON.stringify(res)); 
        //     }
        // )
    }

    async get_detail(dataset:string,index:string){
        const response = this.http.get('http://127.0.0.1:5500/'+`api/detail_index?dataset=${dataset}&index=${index}`,{responseType:"text"})
        // console.log("service_detail", response)
        return response
    }

    async get_data_flask(dataset:string,index:string,startyear:string,startmonth:string,stopyear:string,stopmonth:string){
        const response = this.http.get('http://127.0.0.1:5500/'+
            `/api/data_avg?dataset=${dataset}&index=${index}&startyear=${startyear}&startmonth=${startmonth}&stopyear=${stopyear}&stopmonth=${stopmonth}`
            ,{responseType:"text"}
            )
        return response
    }

    async data_dif(dataset:string,index:string,start1:string,stop1:string,start2:string,stop2:string):Promise<Observable<any>> {
        return this.http.get('http://127.0.0.1:5500' +
        `/api/data_dif?dataset=${dataset}&index=${index}&start1=${start1}&stop1=${stop1}&start2=${start2}&stop2=${stop2}`);
    }

    async get_Avgcsv(ncfile:string,df_f:string,startyear:string,stopyear:string,startmonth:string,stopmonth:string){
        const response = this.http.get('http://127.0.0.1:5500' +
        `/nc_avg?ncfile=${ncfile}&df_f=${df_f}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}`
        ,{responseType:"text"});

        return response
        }

    async get_hire(ncfile:string,df_f:string,startyear:string,stopyear:string,startmonth:string,stopmonth:string){
        const response = this.http.get('http://127.0.0.1:5500' +
        `/nc_avg_hire?ncfile=${ncfile}&df_f=${df_f}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}`
        ,{responseType:"text"});

        return response
        }

    async nc_per(ncfile:string,df_f:string,start1:string,stop1:string,start2:string,stop2:string):Promise<Observable<any>> {
        return this.http.get('http://127.0.0.1:5500' +
        `/nc_per?ncfile=${ncfile}&df_f=${df_f}&start1=${start1}&stop1=${stop1}&start2=${start2}&stop2=${stop2}`
        ,{responseType:"text"});
    }

    async global_avg(dataset:string,index:string,startyear:string,startmonth:string,stopyear:string,stopmonth:string){
        const response = this.http.get('http://127.0.0.1:5500' + 
        `/api/global_avg?dataset=${dataset}&index=${index}&startyear=${startyear}&startmonth=${startmonth}&stopyear=${stopyear}&stopmonth=${stopmonth}`)
        return response
    }

    async detail(dataset:string,index:string):Promise<Observable<any>> {
        return this.http.get('http://127.0.0.1:5500' +
        `/api/detail?dataset=${dataset}&index=${index}`);
    }
}
