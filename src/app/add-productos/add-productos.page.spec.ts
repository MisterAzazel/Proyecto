import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProductosPage } from './add-productos.page';

describe('AddProductosPage', () => {
  let component: AddProductosPage;
  let fixture: ComponentFixture<AddProductosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
