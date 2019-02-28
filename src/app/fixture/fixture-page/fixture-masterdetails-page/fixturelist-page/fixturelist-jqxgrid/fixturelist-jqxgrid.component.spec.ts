import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturelistJqxgridComponent } from './fixturelist-jqxgrid.component';

describe('FixturelistJqxgridComponent', () => {
  let component: FixturelistJqxgridComponent;
  let fixture: ComponentFixture<FixturelistJqxgridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturelistJqxgridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturelistJqxgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
