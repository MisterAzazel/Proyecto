import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule]
})
export class ContactoPage implements OnInit {

  _userService = inject(UsersService);
  isAdmin = false;
  isLoggedIn = false;
  isFinalUser = false;
  _router = inject(Router);
  email: string = '';
  nombre: string = '';
  apellido: string= '';


  constructor() { }

  ngOnInit() {
    this.getCurrentUser();
  }

  formContact = new FormGroup({
    name: new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+'), Validators.minLength(2)]),
    email: new FormControl('', [Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'), Validators.minLength(10)]),
    phone: new FormControl('', [Validators.required, Validators.minLength(8)]),
    lastName: new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
    message: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  onSubmit() {
    if (this.formContact.valid) {
      const { name, email, phone, lastName, message } = this.formContact.value;

      // Registrar los datos en Firebase
      const db = getFirestore();
      const data = {
        id: new Date().getTime().toString(),
        name,
        email,
        phone,
        lastName,
        message
      };

      addDoc(collection(db, 'registroContacto'), data)
        .then(() => {
          // Éxito: los datos se registraron correctamente
          console.log('Datos registrados en Firebase.');
          // Puedes realizar acciones adicionales aquí, como mostrar un mensaje de éxito o redirigir a otra página
        })
        .catch((error) => {
          // Error: no se pudieron registrar los datos
          console.error('Error al registrar los datos en Firebase:', error);
          // Puedes manejar el error aquí, como mostrar un mensaje de error al usuario
        });
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
      this._router.navigate(['/']);
    })
    .catch(error => console.log(error));
  }
}
