import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureGreditFormComponent } from './fixture-gredit-form.component';

describe('FixtureGreditFormComponent', () => {
  let component: FixtureGreditFormComponent;
  let fixture: ComponentFixture<FixtureGreditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixtureGreditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixtureGreditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
