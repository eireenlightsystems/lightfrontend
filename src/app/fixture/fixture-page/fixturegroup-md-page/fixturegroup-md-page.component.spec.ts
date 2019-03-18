import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturegroupMdPageComponent } from './fixturegroup-md-page.component';

describe('FixturegroupMdPageComponent', () => {
  let component: FixturegroupMdPageComponent;
  let fixture: ComponentFixture<FixturegroupMdPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturegroupMdPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturegroupMdPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
