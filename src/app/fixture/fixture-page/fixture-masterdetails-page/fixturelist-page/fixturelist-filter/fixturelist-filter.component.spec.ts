import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturelistFilterComponent } from './fixturelist-filter.component';

describe('FixturelistFilterComponent', () => {
  let component: FixturelistFilterComponent;
  let fixture: ComponentFixture<FixturelistFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturelistFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturelistFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
