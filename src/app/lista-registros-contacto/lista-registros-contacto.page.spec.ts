import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaRegistrosContactoPage } from './lista-registros-contacto.page';

describe('ListaRegistrosContactoPage', () => {
  let component: ListaRegistrosContactoPage;
  let fixture: ComponentFixture<ListaRegistrosContactoPage>;

  beforeEach(async() => {
    fixture = TestBed.createComponent(ListaRegistrosContactoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
