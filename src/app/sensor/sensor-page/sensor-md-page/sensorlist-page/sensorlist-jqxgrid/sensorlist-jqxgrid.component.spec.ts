import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorlistJqxgridComponent } from './sensorlist-jqxgrid.component';

describe('SensorlistJqxgridComponent', () => {
  let component: SensorlistJqxgridComponent;
  let fixture: ComponentFixture<SensorlistJqxgridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorlistJqxgridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorlistJqxgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
