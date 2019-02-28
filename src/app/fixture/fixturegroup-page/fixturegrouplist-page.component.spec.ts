import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturegrouplistPageComponent } from './fixturegrouplist-page.component';

describe('FixturegrouplistPageComponent', () => {
  let component: FixturegrouplistPageComponent;
  let fixture: ComponentFixture<FixturegrouplistPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturegrouplistPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturegrouplistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
