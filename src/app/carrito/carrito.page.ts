import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersService } from '../services/users.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { Product } from '../commons/interfaces/user.interface';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CarritoPage implements OnInit {

  _userService = inject(UsersService);
  isAdmin = false;
  isLoggedIn = false;
  isFinalUser = false;
  _router = inject(Router);
  cartProducts: any[] = [];
  _cartService= inject(CartService);
  objetos: any[] = [];

  constructor() { }

  ngOnInit() {
    this.getCurrentUser();
    this.GetAll();
  }

  GetAll() {
    // Obtener todas las claves del sessionStorage
  const keys = Object.keys(sessionStorage);

  // Array para almacenar los objetos recuperados
   this.objetos = [];

  // Iterar sobre las claves y obtener los objetos correspondientes
  for (const key of keys) {
    const value = sessionStorage.getItem(key);
  
  if (value !== null) {
    const objeto = JSON.parse(value);
    this.objetos.push(objeto);
    console.log(this.objetos);
  }
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



