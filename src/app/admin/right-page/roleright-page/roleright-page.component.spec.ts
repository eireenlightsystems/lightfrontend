import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolerightPageComponent } from './roleright-page.component';

describe('RolerightPageComponent', () => {
  let component: RolerightPageComponent;
  let fixture: ComponentFixture<RolerightPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolerightPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolerightPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
