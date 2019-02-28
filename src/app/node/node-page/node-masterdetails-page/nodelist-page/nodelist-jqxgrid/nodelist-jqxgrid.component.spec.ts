import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodelistJqxgridComponent } from './nodelist-jqxgrid.component';

describe('FixturecomJqxgridComponent', () => {
  let component: NodelistJqxgridComponent;
  let fixture: ComponentFixture<NodelistJqxgridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodelistJqxgridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodelistJqxgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
