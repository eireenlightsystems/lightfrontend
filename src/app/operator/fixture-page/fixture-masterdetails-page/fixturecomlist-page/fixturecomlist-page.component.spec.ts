import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturecomlistPageComponent } from './fixturecomlist-page.component';

describe('FixturecomlistPageComponent', () => {
  let component: FixturecomlistPageComponent;
  let fixture: ComponentFixture<FixturecomlistPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturecomlistPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturecomlistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
