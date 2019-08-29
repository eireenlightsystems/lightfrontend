import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayMasterdetailsPageComponent } from './gateway-masterdetails-page.component';

describe('GatewayMasterdetailsPageComponent', () => {
  let component: GatewayMasterdetailsPageComponent;
  let fixture: ComponentFixture<GatewayMasterdetailsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayMasterdetailsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayMasterdetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
