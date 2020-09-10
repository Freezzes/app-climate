import { Component, OnInit } from '@angular/core';
import * as CanvasJS from 'C:/Users/Mewkkn/Downloads/canvasjs-3.0/canvasjs.min';
import { TempsService } from "../temp/temp.service";
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { map } from 'rxjs/operators';
import { Chart } from 'chart.js';
import { from } from 'rxjs';

@Component({
	selector: 'app-plot',
	templateUrl: './plot.component.html',
	styleUrls: ['./plot.component.css'],

	providers: [TempsService]
})
export class PlotComponent implements OnInit {

	constructor(
		private tempsService: TempsService
	) { }

	public data;
	public mdata;

	ngOnInit() {
		this.tempsService.getmean().subscribe(data => { this.data = data })
		this.tempsService.getmeanDB().subscribe(mdata => { this.mdata = mdata })
		this.tempsService.getmean().subscribe(td => console.log("td : ",td))
		this.tempsService.getmeanDB().subscribe(mdata => console.log(mdata))
	}

	async plot() {
			let y = 0;
			let m = []
			let s300201 = []
			let s432301 = []
			let s583201 = []
			let dataPoints1 = []
			let dataPoints2 = []
			let dataPoints3 = []
			let dataPoints4 = []
			this.data.map(u=>{
				dataPoints1.push({
					y:u.y2012
				}),
				dataPoints2.push({
					y:u.y2013
				}),
				dataPoints3.push({
					y:u.y2014
				}),
				dataPoints4.push({
					y:u.y2015
				})
			})
			// let data
			// this.mdata.map(u => {data = u.active})
			// for (var index in data){
			// 	if (data.hasOwnProperty(index)){
			// 		m.push(Number(index))
			// 		s300201.push(Number(300201))
			// 	}
			// }

			let chart = new CanvasJS.Chart("chartContainer", {
				zoomEnabled: true,
				animationEnabled: true,
				exportEnabled: true,
				title: {
					text: "Averange Temperature of 300201"
				},
				subtitles: [{
					text: "Try Zooming and Panning"
				}],
				data: [
					{
						type: "line",
						name: "2012",
						showInLegend: true,
						dataPoints: dataPoints1
					},
					{
						type: "line",
						name: "2013",
						showInLegend: true,
						dataPoints: dataPoints2
					},
					{
						type: "line",
						name: "2014",
						showInLegend: true,
						dataPoints: dataPoints3
					},
					{
						type: "line",
						name: "2015",
						showInLegend: true,
						dataPoints: dataPoints4
					}]
			});

			chart.render();
		
	}
	

	async plotbar() {
		let y = 0;
		let m = []
		let data;
		let s300201 = []
		let s432301 = []
		let s583201 = []
		this.mdata.map(a => {
			data = a.s300201
		})
		console.log(data)
			
		// let barchart = new CanvasJS.Chart("chartContainer", {
		// 	zoomEnabled: true,
		// 	animationEnabled: true,
		// 	exportEnabled: true,
		// 	title: {
		// 		text: "Averange Temperature of 300201"
		// 	},
		// 	subtitles: [{
		// 		text: "Try Zooming and Panning"
		// 	}],
		// 	data: [
		// 		{
		// 			type: "bar",
		// 			name: "2012",
		// 			showInLegend: true,
		// 			dataPoints: s300201
		// 		}]
		// });

		// barchart.render();

		// console.log(this.mdata)

	}

	}