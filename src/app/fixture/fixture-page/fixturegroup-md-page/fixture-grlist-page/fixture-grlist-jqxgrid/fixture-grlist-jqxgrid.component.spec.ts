import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureGrlistJqxgridComponent } from './fixture-grlist-jqxgrid.component';

describe('FixtureGrlistJqxgridComponent', () => {
  let component: FixtureGrlistJqxgridComponent;
  let fixture: ComponentFixture<FixtureGrlistJqxgridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixtureGrlistJqxgridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixtureGrlistJqxgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
