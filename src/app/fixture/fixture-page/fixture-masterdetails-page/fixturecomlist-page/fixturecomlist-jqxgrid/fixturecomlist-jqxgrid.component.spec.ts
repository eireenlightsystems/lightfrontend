import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturecomlistJqxgridComponent } from './fixturecomlist-jqxgrid.component';

describe('FixturecomlistJqxgridComponent', () => {
  let component: FixturecomlistJqxgridComponent;
  let fixture: ComponentFixture<FixturecomlistJqxgridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturecomlistJqxgridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturecomlistJqxgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
