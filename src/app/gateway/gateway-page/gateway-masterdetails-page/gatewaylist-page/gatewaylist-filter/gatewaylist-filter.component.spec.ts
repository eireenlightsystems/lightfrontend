import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewaylistFilterComponent } from './gatewaylist-filter.component';

describe('GatewaylistFilterComponent', () => {
  let component: GatewaylistFilterComponent;
  let fixture: ComponentFixture<GatewaylistFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewaylistFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewaylistFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
