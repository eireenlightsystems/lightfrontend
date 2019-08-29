import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodemapPageComponent } from './nodemap-page.component';

describe('NodemapPageComponent', () => {
  let component: NodemapPageComponent;
  let fixture: ComponentFixture<NodemapPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodemapPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodemapPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
