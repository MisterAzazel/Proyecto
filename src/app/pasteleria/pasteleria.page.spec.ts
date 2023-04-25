import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasteleriaPage } from './pasteleria.page';

describe('PasteleriaPage', () => {
  let component: PasteleriaPage;
  let fixture: ComponentFixture<PasteleriaPage>;

  beforeEach(async() => {
    fixture = TestBed.createComponent(PasteleriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
