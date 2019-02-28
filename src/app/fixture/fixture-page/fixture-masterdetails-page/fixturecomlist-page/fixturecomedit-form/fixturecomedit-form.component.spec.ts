import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturecomeditFormComponent } from './fixturecomedit-form.component';

describe('FixturecomeditFormComponent', () => {
  let component: FixturecomeditFormComponent;
  let fixture: ComponentFixture<FixturecomeditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturecomeditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturecomeditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
