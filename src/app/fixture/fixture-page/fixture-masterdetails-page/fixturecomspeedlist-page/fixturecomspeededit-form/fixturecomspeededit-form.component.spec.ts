import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturecomspeededitFormComponent } from './fixturecomspeededit-form.component';

describe('FixturecomspeededitFormComponent', () => {
  let component: FixturecomspeededitFormComponent;
  let fixture: ComponentFixture<FixturecomspeededitFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturecomspeededitFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturecomspeededitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
