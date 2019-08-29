import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturecomeditSwitchoffFormComponent } from './fixturecomedit-switchoff-form.component';

describe('FixturecomeditSwitchoffFormComponent', () => {
  let component: FixturecomeditSwitchoffFormComponent;
  let fixture: ComponentFixture<FixturecomeditSwitchoffFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturecomeditSwitchoffFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturecomeditSwitchoffFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
