import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'contacto',
    loadComponent: () => import('./contacto/contacto.page').then( m => m.ContactoPage)
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./nosotros/nosotros.page').then( m => m.NosotrosPage)
  },
  {
    path: 'carrito',
    loadComponent: () => import('./carrito/carrito.page').then( m => m.CarritoPage)
  },
  {
    path: 'panaderia',
    loadComponent: () => import('./panaderia/panaderia.page').then( m => m.PanaderiaPage)
  },
  {
    path: 'pasteleria',
    loadComponent: () => import('./pasteleria/pasteleria.page').then( m => m.PasteleriaPage)
  },
];
