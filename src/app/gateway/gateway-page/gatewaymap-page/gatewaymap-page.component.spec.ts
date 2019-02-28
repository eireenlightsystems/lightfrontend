import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewaymapPageComponent } from './gatewaymap-page.component';

describe('GatewaymapPageComponent', () => {
  let component: GatewaymapPageComponent;
  let fixture: ComponentFixture<GatewaymapPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewaymapPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewaymapPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
