import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMdPageComponent } from './user-md-page.component';

describe('UserMdPageComponent', () => {
  let component: UserMdPageComponent;
  let fixture: ComponentFixture<UserMdPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMdPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMdPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
