import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleDictionaryComponent } from './simple-dictionary.component';

describe('SimpledictionaryComponent', () => {
  let component: SimpleDictionaryComponent;
  let fixture: ComponentFixture<SimpleDictionaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleDictionaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleDictionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
