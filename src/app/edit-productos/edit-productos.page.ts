import { Router } from '@angular/router';
import { Product } from './../commons/interfaces/user.interface';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductsService } from '../services/products.service';
import { UsersService } from '../services/users.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-edit-productos',
  templateUrl: './edit-productos.page.html',
  styleUrls: ['./edit-productos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})

export class EditProductosPage implements OnInit {
  _productsService = inject(ProductsService);
  _location = inject(Location);
  product!: Product;
  _router= inject(Router);
  _userService = inject(UsersService);
  isAdmin = false;
  isLoggedIn = false;
  isFinalUser = false;
  
  formEditProduct = new FormGroup({
    category: new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+'), Validators.minLength(2)]),
    description: new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+'), Validators.minLength(10)]),
    img: new FormControl('', [Validators.required, Validators.minLength(8)]),
    name: new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
    price: new FormControl(1, [Validators.required,Validators.pattern('[0-9]*'), Validators.minLength(1)]),
    stock: new FormControl(2, [Validators.required,Validators.pattern('[0-9]*'), Validators.minLength(1)]),
  });

  constructor() { }

  ngOnInit() {
    this.getCurrentUser();
    console.log(this._location.getState());
    this.product = (this._location.getState() as any).product as Product;
    if (this.product) this.setCurrentProduct(this.product);
  }

  setCurrentProduct(Product: any) {
    this.formEditProduct.patchValue(this.product);
  }


  updateProducts() {
    console.log({
      id: this.product.name,
      ...this.formEditProduct.getRawValue(),
    });

    this._productsService.updateProduct({
      id: this.product.name,
      ...this.formEditProduct.getRawValue(),
    } as Product);
    this._router.navigate(['crud-productos']);
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
