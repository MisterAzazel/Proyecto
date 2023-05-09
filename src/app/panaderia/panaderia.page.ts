import { Product } from './../commons/interfaces/user.interface';
import { CartService } from './../services/cart.service';
import { ProductsService } from './../services/products.service';
import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


@Component({
  selector: 'app-panaderia',
  templateUrl: './panaderia.page.html',
  styleUrls: ['./panaderia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PanaderiaPage implements OnInit {

  product$!: Observable<Product[]>;

  products: Product[] = [];
 

  _productService = inject(ProductsService);
  _cartService = inject(CartService)
  _router= inject(Router);
  _userService = inject(UsersService);
  isAdmin = false;
  isLoggedIn = false;
  isFinalUser = false;


  constructor() { 
    this.loadProducto();
  }

  ngOnInit(): void {
    this.getCurrentUser();
    //this.product$ = this._productService.getProduct();
  }

  loadProducto(){
    this._productService.getProduct('panaderia').subscribe( res =>{
      this.products = res;
    }

    )
  }

  addCart(product: Product){
    this._cartService.addProduct(product)
  }

  getCurrentUser(){
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    this.isLoggedIn = true;
    if (user.email == 'admin@gmail.com') {
      this.isAdmin = true;
    }

    else if (user.email == 'finaluser@gmail.com'){
      this.isFinalUser = true;
    }

    else{
      this.isAdmin = false;
      this.isFinalUser = false;
    }
    
    // ...
  } else {
    this.isLoggedIn = false;
    // User is signed out
    // ...
  }
});
  }

  logOut(){
    this._userService.logOut()
    .then(() => {
      this._router.navigate(['reload']);
    })
    .catch(error => console.log(error));
  }

}


