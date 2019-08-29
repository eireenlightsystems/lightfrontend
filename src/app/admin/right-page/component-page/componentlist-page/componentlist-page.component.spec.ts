import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentlistPageComponent } from './componentlist-page.component';

describe('ComponentlistPageComponent', () => {
  let component: ComponentlistPageComponent;
  let fixture: ComponentFixture<ComponentlistPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentlistPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentlistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
