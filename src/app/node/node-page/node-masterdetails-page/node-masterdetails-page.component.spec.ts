import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeMasterdetailsPageComponent } from './node-masterdetails-page.component';

describe('NodeMasterdetailsPageComponent', () => {
  let component: NodeMasterdetailsPageComponent;
  let fixture: ComponentFixture<NodeMasterdetailsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeMasterdetailsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeMasterdetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
