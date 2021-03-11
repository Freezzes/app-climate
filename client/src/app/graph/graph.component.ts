import { Component, OnInit } from '@angular/core';
import { TempService } from '../services/temp.service';
import * as CanvasJS from 'C:/Users/ice/Downloads/cli/canvasjs-3.0.5/canvasjs.min';
import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { map } from 'rxjs/operators';
import { Chart } from 'chart.js';
import { from, range } from 'rxjs';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  providers: [TempService]
})
export class GraphComponent implements OnInit {

  constructor(
    private tempService: TempService
  ) { }


  async ngOnInit() {
  }

  //---------------------------------------------------------------------------------------------------


}
