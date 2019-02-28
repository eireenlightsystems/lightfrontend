import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureeditFormComponent } from './fixtureedit-form.component';

describe('FixtureeditFormComponent', () => {
  let component: FixtureeditFormComponent;
  let fixture: ComponentFixture<FixtureeditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixtureeditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixtureeditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
