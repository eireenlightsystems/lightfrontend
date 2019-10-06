import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPowerFixturePageComponent } from './report-power-fixture-page.component';

describe('ReportPowerfixturePageComponent', () => {
  let component: ReportPowerFixturePageComponent;
  let fixture: ComponentFixture<ReportPowerFixturePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPowerFixturePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPowerFixturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
