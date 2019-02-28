import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeeditFormComponent } from './nodeedit-form.component';

describe('NodeeditFormComponent', () => {
  let component: NodeeditFormComponent;
  let fixture: ComponentFixture<NodeeditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeeditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeeditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
