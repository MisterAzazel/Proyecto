import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministracionPage } from './administracion.page';

describe('AdministracionPage', () => {
  let component: AdministracionPage;
  let fixture: ComponentFixture<AdministracionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdministracionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
