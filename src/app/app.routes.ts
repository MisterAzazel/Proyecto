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
  {
    path: 'noticias',
    loadComponent: () => import('./noticias/noticias.page').then( m => m.NoticiasPage)
  },
  {
    path: 'crud-noticias',
    loadComponent: () => import('./crud-noticias/crud-noticias.page').then( m => m.CrudNoticiasPage)
  },
  {
    path: 'crud-productos',
    loadComponent: () => import('./crud-productos/crud-productos.page').then( m => m.CrudProductosPage)
  },
  {
    path: 'edit-productos',
    loadComponent: () => import('./edit-productos/edit-productos.page').then( m => m.EditProductosPage)
  },
  {
    path: 'add-productos',
    loadComponent: () => import('./add-productos/add-productos.page').then( m => m.AddProductosPage)
  },
  {
    path: 'edit-noticias',
    loadComponent: () => import('./edit-noticias/edit-noticias.page').then( m => m.EditNoticiasPage)
  },
  {
    path: 'administracion',
    loadComponent: () => import('./administracion/administracion.page').then( m => m.AdministracionPage)
  },
  {
    path: 'add-noticias',
    loadComponent: () => import('./add-noticias/add-noticias.page').then( m => m.AddNoticiasPage)
  },
];
