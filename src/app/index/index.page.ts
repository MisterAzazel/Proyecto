import { CommonModule } from '@angular/common';
import { UsersService } from '../services/users.service';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Router } from '@angular/router';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { Product } from '../commons/interfaces/user.interface';
import { Observable } from 'rxjs';
import { ProductsService } from '../services/products.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-index',
  templateUrl: 'index.page.html',
  styleUrls: ['index.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ],
})

export class HomePage implements OnInit{
  _userService = inject(UsersService);
  isAdmin = false;
  isLoggedIn = false;
  isFinalUser = false;
  _router = inject(Router)
  nombre: string = '';
  apellido: string= '';
  compra: any = [];
  filtro: string = 'true';
  product$!: Observable<Product[]>;
  _productService = inject(ProductsService);
  products: Product[] = [];
  _cartService = inject(CartService)


  constructor() {}

  ngOnInit() {
      this.getCurrentUser();
      this.loadDestacadoProducto(this.filtro);
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
        this.nombre = doc.data()['name'];
        this.apellido = doc.data()['lastName'];
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
      this._router.navigate(['reload']);
    })
    .catch(error => console.log(error));
  }

  loadDestacadoProducto(filtro: string){
    this._productService.getDestacadoProduct(filtro).subscribe( res =>{
      this.products = res;
      console.log(this.products);
    }

    )
  }


  getProduct(product: Product) {
    this._router.navigateByUrl('detalle-producto', { state: { product } });
  }

  onClick(product: Product, compra: number){
    this._cartService.Add(product, compra);
  }

}
