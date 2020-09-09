import { Component, OnInit } from '@angular/core';
import * as CanvasJS from 'C:/Users/ice/Downloads/canvasjs-3.0.5/canvasjs.min';
import { TempsService } from "../temp/temp.service";
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.css'],
  
  providers: [TempsService]
})
export class PlotComponent implements OnInit {

  constructor(
	  private tempsService:TempsService
  ) { }

  ngOnInit() {
	let getTemp = [];
	this.tempsService.getTemp().subscribe(res => res.map(value => {getTemp.push(value.temp)}));
	console.log("GET TEMP",getTemp);
	let dataPoints = []
	let y = 0;		
	for ( var i = 0; i < 10000; i++ ) {		  
		y += Math.round(5 + Math.random() * (-5 - 5));	
		dataPoints.push({ y: y});
	}
	let chart = new CanvasJS.Chart("chartContainer", {
		zoomEnabled: true,
		animationEnabled: true,
		exportEnabled: true,
		title: {
			text: "Performance Demo - 10000 DataPoints"
		},
		subtitles:[{
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
	
	// plottemp(){

	// }
}
