import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureMasterdetailsPageComponent } from './fixture-masterdetails-page.component';

describe('FixtureMasterdetailsPageComponent', () => {
  let component: FixtureMasterdetailsPageComponent;
  let fixture: ComponentFixture<FixtureMasterdetailsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixtureMasterdetailsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixtureMasterdetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
