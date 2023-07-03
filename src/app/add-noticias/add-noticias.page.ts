import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { News } from '../commons/interfaces/user.interface';
import { NewsService } from '../services/news.service';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

@Component({
  selector: 'app-add-noticias',
  templateUrl: './add-noticias.page.html',
  styleUrls: ['./add-noticias.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddNoticiasPage implements OnInit {

  _userService = inject(UsersService);
  isAdmin = false;
  isLoggedIn = false;
  isFinalUser = false;
  _router = inject(Router);
  _newsService = inject(NewsService);
  selectedImage: File | null = null;

  constructor() { }

  ngOnInit() {
    this.getCurrentUser();
  }

  formNews = new FormGroup({
    description: new FormControl('', [Validators.required,Validators.pattern('[\\w\\sáéíóúÁÉÍÓÚüÜñÑ,%().-]*'),  Validators.minLength(10)]),
    img: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required,Validators.pattern('[\\w\\sáéíóúÁÉÍÓÚüÜñÑ,%().-]*'), Validators.minLength(3)]),
  });

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  addNews() {
    const storage = getStorage();

    if (this.selectedImage) {
      const fileName = `${new Date().getTime()}_${this.selectedImage.name}`;
      const fileRef = ref(storage, fileName);

      uploadBytes(fileRef, this.selectedImage).then(() => {
        // Obtiene la URL de descarga de la imagen subida
        getDownloadURL(fileRef).then((imageUrl) => {
          // Crea un objeto con los datos de la noticia
          const newsData: News = {
            id: new Date().getTime().toString(),
            description: this.formNews.get('description')!.value as string,
            img: imageUrl, // Asigna directamente la URL de descarga al campo "img" del objeto newsData
            title: this.formNews.get('title')!.value as string,
          };

          // Guarda la noticia en Firestore
          this._newsService.addNews(newsData).then(() => {
            this._router.navigate(['crud-noticias']);
          });
        });
      });
    } else {
      console.log("Inserta una imagen");
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
