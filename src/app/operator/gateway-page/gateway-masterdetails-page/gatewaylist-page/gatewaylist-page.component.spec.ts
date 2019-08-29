import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewaylistPageComponent } from './gatewaylist-page.component';

describe('GatewaylistPageComponent', () => {
  let component: GatewaylistPageComponent;
  let fixture: ComponentFixture<GatewaylistPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewaylistPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewaylistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
