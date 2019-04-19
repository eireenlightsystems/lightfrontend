import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JqxgridComponent } from './jqxgrid.component';

describe('JqxgridComponent', () => {
  let component: JqxgridComponent;
  let fixture: ComponentFixture<JqxgridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JqxgridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JqxgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
