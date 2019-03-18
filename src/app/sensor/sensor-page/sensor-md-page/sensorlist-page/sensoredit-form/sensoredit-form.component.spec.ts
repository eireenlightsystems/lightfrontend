import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensoreditFormComponent } from './sensoredit-form.component';

describe('SensoreditFormComponent', () => {
  let component: SensoreditFormComponent;
  let fixture: ComponentFixture<SensoreditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensoreditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensoreditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
