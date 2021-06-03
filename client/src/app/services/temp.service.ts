import { Injectable } from '@angular/core'
import { HttpClient, HttpClientModule ,HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs'
import { Temp, Plot, meanplot, station5, st, Missing, Boxplotval, data_test, data_db,data_sta, grid } from '../interfaces/temp.interface'
import { from } from 'rxjs'

@Injectable()
export class TempService {
    private apiURL = 'http://127.0.0.1:5000'
    constructor(private http: HttpClient) { }

    async getrangeyear(station:string,startyear:string,endyear:string,startmonth:string,endmonth:string,startday:string,endday:string):Promise<Observable<any>> {   
        return this.http.get('http://127.0.0.1:5000/api' +
                         `/rangeyear?station=${station}&startyear=${startyear}&endyear=${endyear}&startmonth=${startmonth}&endmonth=${endmonth}&startday=${startday}&endday=${endday}`)
                         
    }

    async getrangecsv(station:string,startyear:string,stopyear:string,startmonth:string,stopmonth:string):Promise<Observable<any>> {   
        return this.http.get('http://127.0.0.1:5000/api' +
                         `/rangecsv?station=${station}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}`)
                         
    }

    async getboxvalue(df:string,showtype:string,station:string,start_date:string,end_date:string):Promise<Observable<any>>{
        return this.http.get('http://127.0.0.1:5000/api'+
                        `/boxplotvalue?df=${df}&showtype=${showtype}&station=${station}&start_date=${start_date}&end_date=${end_date}`)
    }

    async getboxplot(df:string,station:string,start_date:string,end_date:string):Promise<Observable<Boxplotval>>{
        const response:Observable<any> = this.http.get('http://127.0.0.1:5000/api/'+
                        `boxplot?df=${df}&station=${station}&start_date=${start_date}&end_date=${end_date}`)
        return response
    }

    async getMissed(): Promise<Missing[]> {
        let result = [];
        this.http.get<Missing[]>('http://127.0.0.1:5000/api/missing')
            .subscribe(res => {
                result.push(res);
            })
        return result;
    }
    async getmissing(dff:string):Promise<Observable<any>>{
        return this.http.get('http://127.0.0.1:5000/api'+
                        `/selectmissing?&dff=${dff}`
        )}

    async getanomaly(station:string,dff:string){
        return this.http.get('http://127.0.0.1:5000'+
                            `/api/line?station=${station}&dff=${dff}`
        )
    }

    async getanomalync(ncfile:string,filename:string){
        const response = this.http.get('http://127.0.0.1:5000' + 
                            `/api/anomalyNC?ncfile=${ncfile}&filename=${filename}`)
        return response
    }

    async getanomaly_global_rcp(dataset:string,index:string,type_:string,rcp:string){
        const response = this.http.get('http://127.0.0.1:5000'+ 
                            `/api/anomalyNC_rcp?dataset=${dataset}&index=${index}&type_=${type_}&rcp=${rcp}`)
        return response
    }

    getData(){
        return this.http.get('http://127.0.0.1:5000/api/missing')
    }


    async nc_defer(df_f:string,start1:string,stop1:string,start2:string,stop2:string):Promise<Observable<any>> {
        return this.http.get('http://127.0.0.1:5000' +
        `/nc_defer?df_f=${df_f}&start1=${start1}&stop1=${stop1}&start2=${start2}&stop2=${stop2}`);
    }

    async nc_permonth(ncfile:string,df_f:string,start1:string,stop1:string,month:string):Promise<Observable<any>> {
        return this.http.get('http://127.0.0.1:5000' +
        `/nc_permonth?ncfile=${ncfile}&df_f=${df_f}&start1=${start1}&stop1=${stop1}&month=${month}`
        ,{responseType:"text"});
    }
    async get_Avgcsv(ncfile:string,df_f:string,startyear:string,stopyear:string,startmonth:string,stopmonth:string){
        const response = this.http.get('http://127.0.0.1:5000' +
        `/nc_avg?ncfile=${ncfile}&df_f=${df_f}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}`
        ,{responseType:"text"});
        return response
    }

    async get_lowres_rcp(dataset: string, index: string, startyear: string, stopyear: string, startmonth: string, stopmonth: string,rcp:string,type_:string) {
        const response = this.http.get(this.apiURL +
            `/map_rcp?dataset=${dataset}&index=${index}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}&rcp=${rcp}&type_=${type_}`
            , { responseType: "text" });

        return response
    }
    async get_Avgcsvtrend(ncfile:string,df_f:string,startyear:string,stopyear:string,startmonth:string,stopmonth:string){
        const response = this.http.get('http://127.0.0.1:5000' +
        `/nc_avgtrend?ncfile=${ncfile}&df_f=${df_f}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}`
        ,{responseType:"text"});
        return response
    }

    async get_rcptrend(ncfile:string,index:string,type_:string,rcp:string,startyear:string,stopyear:string,startmonth:string,stopmonth:string){
        const response = this.http.get('http://127.0.0.1:5000' +
        `/rcp_avgtrend?ncfile=${ncfile}&index=${index}&type_=${type_}&rcp=${rcp}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}`
        ,{responseType:"text"});
        return response
    }

    async getdata_sta(df_f:string,startdate:string,stopdate:string): Promise<Observable<any>>{
        return this.http.get('http://127.0.0.1:5000'+ `/locat/station?df_f=${df_f}&startdate=${startdate}&stopdate=${stopdate}`)
    }

    async get_detail(dataset:string,index:string){
        const response = this.http.get('http://127.0.0.1:5000/'+`api/detail_index?dataset=${dataset}&index=${index}`,{responseType:"text"})
        // console.log("service_detail", response)
        return response
    }
    async get_data_flask(dataset:string,index:string,startyear:string,startmonth:string,stopyear:string,stopmonth:string){
        const response = this.http.get('http://127.0.0.1:5000/'+
            `/api/data_avg?dataset=${dataset}&index=${index}&startyear=${startyear}&startmonth=${startmonth}&stopyear=${stopyear}&stopmonth=${stopmonth}`
            ,{responseType:"text"}
            )
        return response
    }
    async data_dif(dataset:string,index:string,start1:string,stop1:string,start2:string,stop2:string):Promise<Observable<any>> {
        return this.http.get('http://127.0.0.1:5000' +
        `/api/data_dif?dataset=${dataset}&index=${index}&start1=${start1}&stop1=${stop1}&start2=${start2}&stop2=${stop2}`);
    }
    async get_hire(ncfile:string,df_f:string,startyear:string,stopyear:string,startmonth:string,stopmonth:string){
        const response = this.http.get('http://127.0.0.1:5000' +
        `/nc_avg_hire?ncfile=${ncfile}&df_f=${df_f}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}`
        ,{responseType:"text"});
        return response
    }

    async global_avg(dataset:string,index:string,startyear:string,startmonth:string,stopyear:string,stopmonth:string){
        const response = this.http.get('http://127.0.0.1:5000' + 
        `/api/global_avg?dataset=${dataset}&index=${index}&startyear=${startyear}&startmonth=${startmonth}&stopyear=${stopyear}&stopmonth=${stopmonth}`)
        return response
    }

    async global_avg_rcp(dataset: string, index: string, startyear: string, startmonth: string, stopyear: string, stopmonth: string,rcp:string,type_:string) {
        const response = this.http.get(this.apiURL +
            `/api/global_avg_rcp?dataset=${dataset}&index=${index}&startyear=${startyear}&startmonth=${startmonth}&stopyear=${stopyear}&stopmonth=${stopmonth}&rcp=${rcp}&type_=${type_}`)
        return response
    }


    // ----------------------------------------different----------------------------
    async per_dif(ncfile: string, df_f: string, start1: string, stop1: string, start2: string, stop2: string,rcp:string,type_:string): Promise<Observable<any>> {
        return this.http.get(this.apiURL +
            `/per_dif?ncfile=${ncfile}&df_f=${df_f}&start1=${start1}&stop1=${stop1}&start2=${start2}&stop2=${stop2}&rcp=${rcp}&type_=${type_}`
            , { responseType: "text" });
    }

    async raw_dif(ncfile: string, df_f: string, start1: string, stop1: string, start2: string, stop2: string,rcp:string,type_:string): Promise<Observable<any>> {
        return this.http.get(this.apiURL +
            `/raw_dif?ncfile=${ncfile}&df_f=${df_f}&start1=${start1}&stop1=${stop1}&start2=${start2}&stop2=${stop2}&rcp=${rcp}&type_=${type_}`
            , { responseType: "text" });
    }

    async map_range1(dataset: string, index: string, start: string, stop: string,rcp:string,type_:string): Promise<Observable<any>> {
        return this.http.get(this.apiURL +
            `/map_range1?dataset=${dataset}&index=${index}&start=${start}&stop=${stop}&rcp=${rcp}&type_=${type_}`
            , { responseType: "text" });
    }

    async map_range2(dataset: string, index: string, start: string, stop: string,rcp:string,type_:string): Promise<Observable<any>> {
        return this.http.get(this.apiURL +
            `/map_range2?dataset=${dataset}&index=${index}&start=${start}&stop=${stop}&rcp=${rcp}&type_=${type_}`
            , { responseType: "text" });
    }

    async map_range1month(dataset:string,index:string,start:string,stop:string,month:string,rcp:string,type_:string):Promise<Observable<any>> {
        return this.http.get('http://127.0.0.1:5000' +
        `/map_range1month?dataset=${dataset}&index=${index}&start=${start}&stop=${stop}&month=${month}&rcp=${rcp}&type_=${type_}`
        ,{responseType:"text"});
    }

    async map_range2month(dataset:string,index:string,start:string,stop:string,month:string,rcp:string,type_:string):Promise<Observable<any>> {
        return this.http.get('http://127.0.0.1:5000' +
        `/map_range2month?dataset=${dataset}&index=${index}&start=${start}&stop=${stop}&month=${month}&rcp=${rcp}&type_=${type_}`
        ,{responseType:"text"});
    }
// -------------------------------dataset index detail --------------------------------------------
    async get_dataset(): Promise<Observable<any>>{
        return this.http.get('http://127.0.0.1:5000/api/dataset')
    }

    // async get_index(): Promise<Observable<any>> {
    //     return this.http.get('http://127.0.0.1:5000/api/index')
    // }

    async get_index(dataset: string): Promise<Observable<any>> {
        // console.log("service",this.http.get('http://127.0.0.1:5000/locat/station'))
        return this.http.get(this.apiURL +`/api/index?dataset=${dataset}`)
    }


    async detail(dataset:string,index:string):Promise<Observable<any>> {
        return this.http.get('http://127.0.0.1:5000' +
        `/api/detail?dataset=${dataset}&index=${index}`);
    }

    async get_dataset_rcp(): Promise<Observable<any>> {
        return this.http.get('http://127.0.0.1:5000/api/dataset_rcp')
    }

    async get_index_rcp(type_: string): Promise<Observable<any>> {
        // console.log("service",this.http.get('http://127.0.0.1:5000/locat/station'))
        return this.http.get(this.apiURL +`/api/index_rcp?type_=${type_}`)
    }

    async detail_rcp(dataset: string, index: string,type_:string): Promise<Observable<any>> {
        return this.http.get(this.apiURL +
            `/api/detail_rcp?dataset=${dataset}&index=${index}&type_=${type_}`);
    }

    // -------------------------------------------------------------------------------------------

    getCountry(dataset:string,index:string,startyear:string,stopyear:string,startmonth:string,stopmonth:string,country:any): Observable<any>{
        console.log("country",country)
        const httpOptions = {
          headers: new HttpHeaders({
            'country':  country,
          })
        };
        console.log("country in ser",httpOptions)
        
        return this.http.get('http://127.0.0.1:5000'+`/api/country_avg?dataset=${dataset}&index=${index}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}`,httpOptions)
    }

    getCountry_rcp(dataset: string, index: string, startyear: string, stopyear: string, startmonth: string, stopmonth: string, country: any,rcp:string,type_:string): Observable<any> {
        console.log("country", country)
        const httpOptions = {
            headers: new HttpHeaders({
                'country': country,
            })
        };
        return this.http.get(this.apiURL + `/api/country_avg_rcp?dataset=${dataset}&index=${index}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}&rcp=${rcp}&type_=${type_}`, httpOptions)
    }


    anomalyCountry(dataset:string,index:string,country:any): Observable<any>{
        console.log("country",country)
        const httpOptions = {
          headers: new HttpHeaders({
            'country':  country,
          })
        };
        console.log("country anomaly",httpOptions)
        
        return this.http.get('http://127.0.0.1:5000'+`/api/anomalycountry?dataset=${dataset}&index=${index}`,httpOptions)
    }

    anomalyCountry_rcp(dataset:string,index:string,country:any,rcp:string,type_:string): Observable<any>{
        console.log("country",country)
        const httpOptions = {
          headers: new HttpHeaders({
            'country':  country,
          })
        };
        console.log("country anomaly rcp",httpOptions)
                                                     
        return this.http.get('http://127.0.0.1:5000'+`/api/anomalycountry_rcp?dataset=${dataset}&index=${index}&type_=${type_}&rcp=${rcp}`,httpOptions)
    }

    async getSelectCountry(dataset:string,index:string,startyear:string,stopyear:string,startmonth:string,stopmonth:string): Promise<Observable<any>>{
        return this.http.get('http://127.0.0.1:5000'+`/api/country_avg?dataset=${dataset}&index=${index}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}`)
    }
// -------------------------------------------------------------------------------------------------------

    // async check_data(dataset:string,index:string,startyear:string,stopyear:string): Promise<Observable<any>>{
    //     return this.http.get('http://127.0.0.1:5000'+`/check_data?dataset=${dataset}&index=${index}&startyear=${startyear}&stopyear=${stopyear}`,{responseType:"text"})
    // }

}
