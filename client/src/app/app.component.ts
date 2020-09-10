import { Component } from '@angular/core';
import { InjectionToken } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
}
export const INIT_COORDS = new InjectionToken<{lat: number, long: number}>('INIT_COORDS');
