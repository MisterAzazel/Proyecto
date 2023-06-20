import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

@Component({
  selector: 'app-boleta',
  templateUrl: './boleta.page.html',
  styleUrls: ['./boleta.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BoletaPage implements OnInit {

  _userService = inject(UsersService);
  isAdmin = false;
  isLoggedIn = false;
  isFinalUser = false;
  _router = inject(Router);
  email: string = '';
  nombre: string = '';
  apellido: string= '';
  objetos: any[] = [];
  total: number = 0;

  constructor() { }

  ngOnInit() {
    this.GetAll();
    this.calcularPrecioTotal();
    this.getCurrentUser();
    this.generarPDF();
  }

  getCurrentUser() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        this.isLoggedIn = true;
        const email = user.email;
        this.getUserDataByEmail(email).then(() => {
        });
      } else {
        this.isLoggedIn = false;
        // User is signed out
        // ...
      }
    });
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

  calcularPrecioTotal() {
    this.total = 0; // Reinicia el valor a cero

    for (const arr of this.objetos) {
      for (const objeto of arr) {
        this.total += objeto.price * objeto.compra;
      }
    }
  }

  generarPDF() {
    this.generarBoletaPDF(this.nombre, this.apellido, this.objetos, this.total);
  }

  generarBoletaPDF(nombre: string, apellido: string, objetos: any[], total: number) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/boleta', true);
    xhr.responseType = 'blob';

    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = new Blob([xhr.response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'boleta.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    };

    xhr.send();
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
}