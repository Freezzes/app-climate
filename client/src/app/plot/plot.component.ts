import { Component, OnInit } from '@angular/core';
import * as CanvasJS from 'C:/Users/Mewkkn/Downloads/canvasjs-3.0/canvasjs.min';
import { TempsService } from "../temp/temp.service";
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { map } from 'rxjs/operators';

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

	ngOnInit() {
		this.tempsService.getTemp().subscribe(data => { this.data = data })
	}

	plot() {
		console.log(this.data)
		let y = 0;
		let dataPoints = []
		this.data.map(u=>{
			dataPoints.push({
				y:u.s300201,
				x:u.day
			})
		})
		let chart = new CanvasJS.Chart("chartContainer", {
			zoomEnabled: true,
			animationEnabled: true,
			exportEnabled: true,
			title: {
				text: "Performance Demo - 10000 DataPoints"
			},
			subtitles: [{
				text: "Try Zooming and Panning"
			}],
			data: [
				{
					type: "line",
					dataPoints: dataPoints
				}]
		});
		chart.render();
	}
}
