import { Router } from '@angular/router';
import { Product } from './../commons/interfaces/user.interface';
import { ProductsService } from './../services/products.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersService } from '../services/users.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

@Component({
  selector: 'app-crud-productos',
  templateUrl: './crud-productos.page.html',
  styleUrls: ['./crud-productos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class CrudProductosPage implements OnInit {

  products: Product[] = [];
  _productsService = inject(ProductsService)
  _router = inject(Router);
  _userService = inject(UsersService);
  isAdmin = false;
  isLoggedIn = false;
  isFinalUser = false;

  constructor() { }

  ngOnInit() {
    this.loadProducto();
    this.getCurrentUser();
  }

  formProduct = new FormGroup({
    category: new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+'), Validators.minLength(2)]),
    description: new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+'), Validators.minLength(10)]),
    img: new FormControl('', [Validators.required, Validators.minLength(8)]),
    name: new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
    price: new FormControl(1, [Validators.required,Validators.pattern('[0-9]*'), Validators.minLength(1)]),
    stock: new FormControl(2, [Validators.required,Validators.pattern('[0-9]*'), Validators.minLength(1)]),
  });

  addProduct(){
    this._productsService.addProduct({
      id: new Date().getTime().toString(),
      ...this.formProduct.getRawValue(),
    } as Product);
  }

  loadProducto(){
    this._productsService.getProduct().subscribe( res =>{
      this.products = res;
    }

    )
  }

  editProduct(product: Product) {
    this._router.navigateByUrl('edit-productos', { state: { product } });
  }

  deleteProduct(product: Product) {
    if (confirm(`Seguro de borrar a ${product.name}`)) {
      this._productsService.deleteProduct(product.id);
    }
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

  logOut(){
    this._userService.logOut()
    .then(() => {
      this._router.navigate(['/']);
    })
    .catch(error => console.log(error));
  }

}
