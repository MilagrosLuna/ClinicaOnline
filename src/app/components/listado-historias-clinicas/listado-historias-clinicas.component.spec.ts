import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoHistoriasClinicasComponent } from './listado-historias-clinicas.component';

describe('ListadoHistoriasClinicasComponent', () => {
  let component: ListadoHistoriasClinicasComponent;
  let fixture: ComponentFixture<ListadoHistoriasClinicasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListadoHistoriasClinicasComponent]
    });
    fixture = TestBed.createComponent(ListadoHistoriasClinicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
