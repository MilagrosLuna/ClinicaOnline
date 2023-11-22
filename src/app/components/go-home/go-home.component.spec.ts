import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoHomeComponent } from './go-home.component';

describe('GoHomeComponent', () => {
  let component: GoHomeComponent;
  let fixture: ComponentFixture<GoHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoHomeComponent]
    });
    fixture = TestBed.createComponent(GoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
