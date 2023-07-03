import { registroContacto } from './../commons/interfaces/user.interface';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { ContactoService } from '../services/contacto.service';

@Component({
  selector: 'app-lista-registros-contacto',
  templateUrl: './lista-registros-contacto.page.html',
  styleUrls: ['./lista-registros-contacto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ListaRegistrosContactoPage implements OnInit {
  _userService = inject(UsersService);
  isAdmin = false;
  isLoggedIn = false;
  isFinalUser = false;
  _router = inject(Router)
  registroContacto: registroContacto[] = [];
  _contactoService = inject(ContactoService)

  constructor(private firestore : Firestore, private auth: Auth) { }

  ngOnInit() {
    this.getCurrentUser();
    this.loadRegistroContacto();
}

getRegistroContacto(registroContacto: registroContacto) {
  this._router.navigateByUrl('detalle-registros-contacto', { state: { registroContacto } });
}

loadRegistroContacto(){
  this._contactoService.getRegistroContacto().subscribe( res =>{
    this.registroContacto = res;
  }

  )
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
