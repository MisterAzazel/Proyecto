import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudNoticiasPage } from './crud-noticias.page';

describe('CrudNoticiasPage', () => {
  let component: CrudNoticiasPage;
  let fixture: ComponentFixture<CrudNoticiasPage>;

  beforeEach(async() => {
    fixture = TestBed.createComponent(CrudNoticiasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
