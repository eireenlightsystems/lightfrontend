import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodelinkFormComponent } from './nodelink-form.component';

describe('NodelinkFormComponent', () => {
  let component: NodelinkFormComponent;
  let fixture: ComponentFixture<NodelinkFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodelinkFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodelinkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
