import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewaylinkFormComponent } from './gatewaylink-form.component';

describe('GatewaylinkFormComponent', () => {
  let component: GatewaylinkFormComponent;
  let fixture: ComponentFixture<GatewaylinkFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewaylinkFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewaylinkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
