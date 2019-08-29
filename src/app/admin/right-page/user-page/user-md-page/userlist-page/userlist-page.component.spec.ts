import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlistPageComponent } from './userlist-page.component';

describe('UserlistPageComponent', () => {
  let component: UserlistPageComponent;
  let fixture: ComponentFixture<UserlistPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserlistPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserlistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
