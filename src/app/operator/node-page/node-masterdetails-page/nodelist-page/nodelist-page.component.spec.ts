import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodelistPageComponent } from './nodelist-page.component';

describe('NodelistPageComponent', () => {
  let component: NodelistPageComponent;
  let fixture: ComponentFixture<NodelistPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodelistPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodelistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
