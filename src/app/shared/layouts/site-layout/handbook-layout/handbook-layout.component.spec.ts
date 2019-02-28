import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandbookLayoutComponent } from './handbook-layout.component';

describe('HandbookLayoutComponent', () => {
  let component: HandbookLayoutComponent;
  let fixture: ComponentFixture<HandbookLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandbookLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandbookLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
