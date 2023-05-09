import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditNoticiasPage } from './edit-noticias.page';

describe('EditNoticiasPage', () => {
  let component: EditNoticiasPage;
  let fixture: ComponentFixture<EditNoticiasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditNoticiasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
