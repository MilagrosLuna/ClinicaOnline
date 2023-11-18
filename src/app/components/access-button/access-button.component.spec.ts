import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessButtonComponent } from './access-button.component';

describe('AccessButtonComponent', () => {
  let component: AccessButtonComponent;
  let fixture: ComponentFixture<AccessButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccessButtonComponent]
    });
    fixture = TestBed.createComponent(AccessButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
