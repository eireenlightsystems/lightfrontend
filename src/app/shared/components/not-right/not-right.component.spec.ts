import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotRightComponent } from './not-right.component';

describe('NotRightComponent', () => {
  let component: NotRightComponent;
  let fixture: ComponentFixture<NotRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
