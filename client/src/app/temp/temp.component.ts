import { Component, OnInit } from '@angular/core'
import { Temp } from './temp'
import { TempsService } from './temp.service'
import { HttpClient, HttpClientModule } from '@angular/common/http'

@Component({
    selector: 'app-temp',
    templateUrl: './temp.component.html',
    providers: [TempsService]
})

export class TempComponent implements OnInit {
    temps: Temp[]

    constructor(private tempService: TempsService, private http: HttpClient) { }

    ngOnInit () {
        this.getTemp()
    }

    getTemp () {
        this.tempService.getTemp().subscribe(temps => (this.temps = temps))
    
    }

}