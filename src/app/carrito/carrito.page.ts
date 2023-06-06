import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersService } from '../services/users.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { Product } from '../commons/interfaces/user.interface';
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

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
  precio_total: number = 0;
  email: string = '';
  nombre: string = '';
  apellido: string= '';

  constructor() { }

  ngOnInit() {
    this.getCurrentUser();
    this.GetAll();
    console.log(this.objetos.keys())
    this.calcularPrecioTotal();
  }

  calcularPrecioTotal() {
    this.precio_total = 0; // Reinicia el valor a cero
  
    for (const arr of this.objetos) {
      for (const objeto of arr) {
        this.precio_total += objeto.price * objeto.compra;
      }
    }
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

guardarDatosEnFirebase() {
  const db = getFirestore();
  const docRef = collection(db, 'compras');

  // Convertir this.objetos a un objeto plano
  const productos = this.objetos.reduce((obj, arr) => {
    arr.forEach((objeto: any) => {  // Especifica el tipo de datos de objeto
      obj[objeto.nombre_producto] = objeto;
    });
    return obj;
  }, {});

  const data = {
    id: new Date().getTime().toString(),
    email_comprador: this.email,
    nombre_comprador: this.nombre,
    apellido_comprador: this.apellido,
    productos: productos,
    precio_total: this.precio_total,
    state: false,
  };

  addDoc(docRef, data)
    .then((docRef) => {
      console.log('Datos guardados en Firebase:', docRef.id);
    })
    .catch((error) => {
      console.error('Error al guardar datos en Firebase:', error);
    });
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
      this.email = doc.data()['email'];
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

  borrar(nombre: string){
    this._cartService.Delete(nombre);
    this.GetAll();
    this.calcularPrecioTotal();
  }
 

}



