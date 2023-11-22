import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentacionComponent } from './presentacion.component';

describe('PresentacionComponent', () => {
  let component: PresentacionComponent;
  let fixture: ComponentFixture<PresentacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PresentacionComponent]
    });
    fixture = TestBed.createComponent(PresentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
