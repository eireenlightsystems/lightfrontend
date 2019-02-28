import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayeditFormComponent } from './gatewayedit-form.component';

describe('GatewayeditFormComponent', () => {
  let component: GatewayeditFormComponent;
  let fixture: ComponentFixture<GatewayeditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayeditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayeditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
