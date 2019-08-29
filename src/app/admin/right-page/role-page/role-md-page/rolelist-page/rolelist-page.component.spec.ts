import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolelistPageComponent } from './rolelist-page.component';

describe('RolelistPageComponent', () => {
  let component: RolelistPageComponent;
  let fixture: ComponentFixture<RolelistPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolelistPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolelistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
