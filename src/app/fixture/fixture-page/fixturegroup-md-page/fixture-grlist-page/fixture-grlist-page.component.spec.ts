import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureGrlistPageComponent } from './fixture-grlist-page.component';

describe('FixtureGrlistPageComponent', () => {
  let component: FixtureGrlistPageComponent;
  let fixture: ComponentFixture<FixtureGrlistPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixtureGrlistPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixtureGrlistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
