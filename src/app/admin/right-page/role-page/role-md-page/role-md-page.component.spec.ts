import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMdPageComponent } from './role-md-page.component';

describe('RoleMdPageComponent', () => {
  let component: RoleMdPageComponent;
  let fixture: ComponentFixture<RoleMdPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleMdPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleMdPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
