import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturemapPageComponent } from './fixturemap-page.component';

describe('FixturemapPageComponent', () => {
  let component: FixturemapPageComponent;
  let fixture: ComponentFixture<FixturemapPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturemapPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturemapPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
