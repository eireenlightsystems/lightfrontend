import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturecomspeedlistJqxgridComponent } from './fixturecomspeedlist-jqxgrid.component';

describe('FixturecomspeedlistJqxgridComponent', () => {
  let component: FixturecomspeedlistJqxgridComponent;
  let fixture: ComponentFixture<FixturecomspeedlistJqxgridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturecomspeedlistJqxgridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturecomspeedlistJqxgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
