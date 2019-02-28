import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturecomspeedlistPageComponent } from './fixturecomspeedlist-page.component';

describe('FixturecomspeedlistPageComponent', () => {
  let component: FixturecomspeedlistPageComponent;
  let fixture: ComponentFixture<FixturecomspeedlistPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturecomspeedlistPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturecomspeedlistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
