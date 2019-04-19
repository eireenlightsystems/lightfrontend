import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFormItemComponent } from './edit-form-item.component';

describe('EditFormItemComponent', () => {
  let component: EditFormItemComponent;
  let fixture: ComponentFixture<EditFormItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFormItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFormItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
