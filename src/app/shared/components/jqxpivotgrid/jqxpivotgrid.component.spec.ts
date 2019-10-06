import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JqxpivotgridComponent } from './jqxpivotgrid.component';

describe('JqxpivotgridComponent', () => {
  let component: JqxpivotgridComponent;
  let fixture: ComponentFixture<JqxpivotgridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JqxpivotgridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JqxpivotgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
