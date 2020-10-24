import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetcdfComponent } from './netcdf.component';

describe('NetcdfComponent', () => {
  let component: NetcdfComponent;
  let fixture: ComponentFixture<NetcdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetcdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetcdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
