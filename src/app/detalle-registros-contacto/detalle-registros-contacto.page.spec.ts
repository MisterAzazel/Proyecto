import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleRegistrosContactoPage } from './detalle-registros-contacto.page';

describe('DetalleRegistrosContactoPage', () => {
  let component: DetalleRegistrosContactoPage;
  let fixture: ComponentFixture<DetalleRegistrosContactoPage>;

  beforeEach(async() => {
    fixture = TestBed.createComponent(DetalleRegistrosContactoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
