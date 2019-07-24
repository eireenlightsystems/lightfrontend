import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSuggestionsComponent } from './ngx-suggestions.component';

describe('NgxSuggestionsComponent', () => {
  let component: NgxSuggestionsComponent;
  let fixture: ComponentFixture<NgxSuggestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxSuggestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
