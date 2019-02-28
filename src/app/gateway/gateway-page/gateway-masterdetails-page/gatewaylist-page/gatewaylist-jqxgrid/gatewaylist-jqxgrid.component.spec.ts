import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewaylistJqxgridComponent } from './gatewaylist-jqxgrid.component';

describe('GatewaylistJqxgridComponent', () => {
  let component: GatewaylistJqxgridComponent;
  let fixture: ComponentFixture<GatewaylistJqxgridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewaylistJqxgridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewaylistJqxgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
