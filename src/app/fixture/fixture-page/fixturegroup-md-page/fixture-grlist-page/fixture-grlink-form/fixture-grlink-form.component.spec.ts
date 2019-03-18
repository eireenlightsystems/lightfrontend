import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureGrlinkFormComponent } from './fixture-grlink-form.component';

describe('FixtureGrlinkFormComponent', () => {
  let component: FixtureGrlinkFormComponent;
  let fixture: ComponentFixture<FixtureGrlinkFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixtureGrlinkFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixtureGrlinkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
