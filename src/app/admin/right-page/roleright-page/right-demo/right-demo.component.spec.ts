import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightDemoComponent } from './right-demo.component';

describe('RightDemoComponent', () => {
  let component: RightDemoComponent;
  let fixture: ComponentFixture<RightDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
