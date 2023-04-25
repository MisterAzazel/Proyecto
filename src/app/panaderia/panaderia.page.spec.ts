import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanaderiaPage } from './panaderia.page';

describe('PanaderiaPage', () => {
  let component: PanaderiaPage;
  let fixture: ComponentFixture<PanaderiaPage>;

  beforeEach(async() => {
    fixture = TestBed.createComponent(PanaderiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
