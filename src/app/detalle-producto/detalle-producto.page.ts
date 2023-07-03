import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductsService } from '../services/products.service';
import { Product } from '../commons/interfaces/user.interface';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class DetalleProductoPage implements OnInit {
  _productsService = inject(ProductsService);
  _location = inject(Location);
  _cartService = inject(CartService);
  product!: Product;
  _router= inject(Router);
  _userService = inject(UsersService);
  isAdmin = false;
  isLoggedIn = false;
  isFinalUser = false;
  compra: any = [];

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

  getCurrentUser(){
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    this.isLoggedIn = true;
    const email = user.email;
    this.getUserDataByEmail(email);
  }
  // ...
  else {
    this.isLoggedIn = false;
    // User is signed out
    // ...
  }

});
  }

getUserDataByEmail(email: any) {

// Obtiene una referencia a la instancia de Firestore
const db = getFirestore();
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    return getDocs(q)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log('ID:', doc.id); // ID del documento
        console.log('Data:', doc.data()); // Todos los datos del documento
        if (doc.data()['role']['admin'] === true) {
          this.isAdmin = true;
        }

        else if (doc.data()['role']['final'] == true){
          this.isFinalUser = true;
        }

        else{
          this.isAdmin = false;
          this.isFinalUser = false;
        }


    });
    })
    .catch((error) => {
      console.error('Error al obtener los datos:', error);
    });
  }

  onClick(product: Product, compra: number){
    this._cartService.Add(product, compra);
  }

  logOut(){
    this._userService.logOut()
    .then(() => {
      this._router.navigate(['/']);
    })
    .catch(error => console.log(error));
  }

}
