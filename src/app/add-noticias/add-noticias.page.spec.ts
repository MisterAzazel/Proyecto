import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNoticiasPage } from './add-noticias.page';

describe('AddNoticiasPage', () => {
  let component: AddNoticiasPage;
  let fixture: ComponentFixture<AddNoticiasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddNoticiasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
