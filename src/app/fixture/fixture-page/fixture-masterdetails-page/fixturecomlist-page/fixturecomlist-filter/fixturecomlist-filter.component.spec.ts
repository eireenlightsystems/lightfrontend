import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturecomlistFilterComponent } from './fixturecomlist-filter.component';

describe('FixturecomlistFilterComponent', () => {
  let component: FixturecomlistFilterComponent;
  let fixture: ComponentFixture<FixturecomlistFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturecomlistFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturecomlistFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
