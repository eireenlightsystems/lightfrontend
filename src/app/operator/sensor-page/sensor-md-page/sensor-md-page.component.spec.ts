import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorMdPageComponent } from './sensor-md-page.component';

describe('SensorMdPageComponent', () => {
  let component: SensorMdPageComponent;
  let fixture: ComponentFixture<SensorMdPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorMdPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorMdPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
