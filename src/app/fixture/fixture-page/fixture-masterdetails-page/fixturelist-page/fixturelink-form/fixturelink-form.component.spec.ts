import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturelinkFormComponent } from './fixturelink-form.component';

describe('FixturelinkFormComponent', () => {
  let component: FixturelinkFormComponent;
  let fixture: ComponentFixture<FixturelinkFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturelinkFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturelinkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
