import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorlistPageComponent } from './sensorlist-page.component';

describe('SensorlistPageComponent', () => {
  let component: SensorlistPageComponent;
  let fixture: ComponentFixture<SensorlistPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorlistPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorlistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
