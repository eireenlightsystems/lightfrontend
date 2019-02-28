import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturePageComponent } from './fixture-page.component';

describe('FixturePageComponent', () => {
  let component: FixturePageComponent;
  let fixture: ComponentFixture<FixturePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
