import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetcdfgraphComponent } from './netcdfgraph.component';

describe('NetcdfgraphComponent', () => {
  let component: NetcdfgraphComponent;
  let fixture: ComponentFixture<NetcdfgraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetcdfgraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetcdfgraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
