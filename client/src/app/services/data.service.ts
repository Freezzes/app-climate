import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable()

export class DataService {
    private apiURL = 'http://127.0.0.1:5000';
    constructor(private http: HttpClient) { }

    async getdata_sta(df_f: string, startyear: string, stopyear: string, startmonth: string, stopmonth: string): Promise<Observable<any>> {
        return this.http.get(this.apiURL + `/locat/station?df_f=${df_f}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}`)
    }

    async get_detail(dataset: string, index: string) {
        const response = this.http.get(this.apiURL + `api/detail_index?dataset=${dataset}&index=${index}`, { responseType: "text" })
        // console.log("service_detail", response)
        return response
    }

    async get_data_flask(dataset: string, index: string, startyear: string, startmonth: string, stopyear: string, stopmonth: string) {
        const response = this.http.get(this.apiURL +
            `/api/data_avg?dataset=${dataset}&index=${index}&startyear=${startyear}&startmonth=${startmonth}&stopyear=${stopyear}&stopmonth=${stopmonth}`
            , { responseType: "text" }
        )
        return response
    }

    async data_dif(dataset: string, index: string, start1: string, stop1: string, start2: string, stop2: string): Promise<Observable<any>> {
        return this.http.get(this.apiURL +
            `/api/data_dif?dataset=${dataset}&index=${index}&start1=${start1}&stop1=${stop1}&start2=${start2}&stop2=${stop2}`);
    }

    // --------------------------------------map---------------------------------------------------------------
    async get_lowres(dataset: string, index: string, startyear: string, stopyear: string, startmonth: string, stopmonth: string) {
        const response = this.http.get(this.apiURL +
            `/nc_avg?dataset=${dataset}&index=${index}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}`
            , { responseType: "text" });

        return response
    }

    async get_lowres_rcp(dataset: string, index: string, startyear: string, stopyear: string, startmonth: string, stopmonth: string,rcp:string,type_:string) {
        const response = this.http.get(this.apiURL +
            `/map_rcp?dataset=${dataset}&index=${index}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}&rcp=${rcp}&type_=${type_}`
            , { responseType: "text" });

        return response
    }

    async global_avg(dataset: string, index: string, startyear: string, startmonth: string, stopyear: string, stopmonth: string) {
        const response = this.http.get(this.apiURL +
            `/api/global_avg?dataset=${dataset}&index=${index}&startyear=${startyear}&startmonth=${startmonth}&stopyear=${stopyear}&stopmonth=${stopmonth}`)
        return response
    }

    async global_avg_rcp(dataset: string, index: string, startyear: string, startmonth: string, stopyear: string, stopmonth: string,rcp:string,type_:string) {
        const response = this.http.get(this.apiURL +
            `/api/global_avg_rcp?dataset=${dataset}&index=${index}&startyear=${startyear}&startmonth=${startmonth}&stopyear=${stopyear}&stopmonth=${stopmonth}&rcp=${rcp}&type_=${type_}`)
        return response
    }

    async detail(dataset: string, index: string): Promise<Observable<any>> {
        return this.http.get(this.apiURL +
            `/api/detail?dataset=${dataset}&index=${index}`);
    }

    async detail_rcp(dataset: string, index: string,type_:string): Promise<Observable<any>> {
        return this.http.get(this.apiURL +
            `/api/detail_rcp?dataset=${dataset}&index=${index}&type_=${type_}`);
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
    // -------------------------------------------------------------------------------------------------------
    async get_dataset(): Promise<Observable<any>> {
        // console.log("service",this.http.get('http://127.0.0.1:5500/locat/station'))
        return this.http.get('http://127.0.0.1:5000/api/dataset')
    }

    async get_dataset_rcp(): Promise<Observable<any>> {
        // console.log("service",this.http.get('http://127.0.0.1:5500/locat/station'))
        return this.http.get('http://127.0.0.1:5000/api/dataset_rcp')
    }

    async get_index(dataset: string): Promise<Observable<any>> {
        // console.log("service",this.http.get('http://127.0.0.1:5500/locat/station'))
        return this.http.get(this.apiURL +`/api/index?dataset=${dataset}`)
    }

    async get_index_rcp(type_: string): Promise<Observable<any>> {
        // console.log("service",this.http.get('http://127.0.0.1:5500/locat/station'))
        return this.http.get(this.apiURL +`/api/index_rcp?type_=${type_}`)
    }

    getCountry(dataset: string, index: string, startyear: string, stopyear: string, startmonth: string, stopmonth: string, country: any): Observable<any> {
        console.log("country", country)
        const httpOptions = {
            headers: new HttpHeaders({
                'country': country,
            })
        };
        return this.http.get(this.apiURL + `/api/country_avg?dataset=${dataset}&index=${index}&startyear=${startyear}&stopyear=${stopyear}&startmonth=${startmonth}&stopmonth=${stopmonth}`, httpOptions)
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

    async nc_anomaly(index: string): Promise<Observable<any>> {
        // console.log("service",this.http.get('http://127.0.0.1:5500/locat/station'))
        return this.http.get(this.apiURL + `/api/na_anomaly?index=${index}`)
    }
}
