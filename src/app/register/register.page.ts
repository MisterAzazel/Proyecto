import { UsersService } from './../services/users.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { User } from '../commons/interfaces/user.interface';
import { error } from 'console';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})


export class RegisterPage  {

  _userService = inject(UsersService);
  _router = inject(Router);
  isAdmin = false;
  isLoggedIn = false;
  isFinalUser = false;

  form = new FormGroup({
      name: new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+'), Validators.minLength(2)]),
      email: new FormControl('', [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), Validators.minLength(10)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      lastName: new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
    });
  
    
  register(){
    this._userService.register(this.form.value)
      .then(response =>{
        this.addUser(response.user.uid)
        console.log(response);
      })
      .catch(error => console.log(error));
  }

  addUser(userId = ''){
    this._userService.addUser({
      id: userId,
      ...this.form.getRawValue(),
      role: {
        cliente: true,
        admin: false,
        final: false,
      }
    } as User);
    this._router.navigate(['login']);
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
      this._router.navigate(['reload']);
    })
    .catch(error => console.log(error));
  }

}
