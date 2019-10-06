import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCountFixturePageComponent } from './report-count-fixture-page.component';

describe('ReportCountfixturePageComponent', () => {
  let component: ReportCountFixturePageComponent;
  let fixture: ComponentFixture<ReportCountFixturePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCountFixturePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCountFixturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
