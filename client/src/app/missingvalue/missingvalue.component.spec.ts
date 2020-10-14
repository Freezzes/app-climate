import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingvalueComponent } from './missingvalue.component';

describe('MissingvalueComponent', () => {
  let component: MissingvalueComponent;
  let fixture: ComponentFixture<MissingvalueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingvalueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingvalueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
