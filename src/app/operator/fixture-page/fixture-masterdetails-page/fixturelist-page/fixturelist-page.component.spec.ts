import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturelistPageComponent } from './fixturelist-page.component';

describe('FixturelistPageComponent', () => {
  let component: FixturelistPageComponent;
  let fixture: ComponentFixture<FixturelistPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturelistPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturelistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
