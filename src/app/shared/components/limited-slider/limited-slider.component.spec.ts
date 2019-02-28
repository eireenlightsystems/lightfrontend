import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitedSliderComponent } from './limited-slider.component';

describe('LimitedSliderComponent', () => {
  let component: LimitedSliderComponent;
  let fixture: ComponentFixture<LimitedSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitedSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitedSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
