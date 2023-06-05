import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { registroContacto } from '../commons/interfaces/user.interface';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { error } from 'console';

@Component({
  selector: 'app-detalle-registros-contacto',
  templateUrl: './detalle-registros-contacto.page.html',
  styleUrls: ['./detalle-registros-contacto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule]
})
export class DetalleRegistrosContactoPage implements OnInit {

  _userService = inject(UsersService);
  isAdmin = false;
  isLoggedIn = false;
  isFinalUser = false;
  _router = inject(Router)
  _location = inject(Location);
  registroContacto!: registroContacto;
  private fromEmail = 'your-email@example.com';
  


  formContact = new FormGroup({
    name: new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+'), Validators.minLength(2)]),
    email: new FormControl('', [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), Validators.minLength(10)]),
    phone: new FormControl(1, [Validators.required, Validators.minLength(8)]),
    lastName: new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
    message: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getCurrentUser();
    console.log(this._location.getState());
    this.registroContacto = (this._location.getState() as any).registroContacto as registroContacto;
    if (this.registroContacto) this.setCurrentContacto(this.registroContacto);
  }

  setCurrentContacto(registroContacto: any) {
    console.log(registroContacto); // Verificar el objeto en la consola
    this.registroContacto = registroContacto;
    this.formContact.patchValue(this.registroContacto);
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
