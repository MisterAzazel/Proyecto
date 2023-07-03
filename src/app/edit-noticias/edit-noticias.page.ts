import { News } from './../commons/interfaces/user.interface';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewsService } from '../services/news.service';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

@Component({
  selector: 'app-edit-noticias',
  templateUrl: './edit-noticias.page.html',
  styleUrls: ['./edit-noticias.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class EditNoticiasPage implements OnInit {

  _newsService = inject(NewsService);
  _location = inject(Location);
  news!: News;
  _router= inject(Router);
  _userService = inject(UsersService);
  isAdmin = false;
  isLoggedIn = false;
  isFinalUser = false;
  selectedImage: File | null = null;


  formEditNews = new FormGroup({
    description: new FormControl('', [Validators.required,Validators.pattern('[\\w\\sáéíóúÁÉÍÓÚüÜñÑ,%().-]*'),  Validators.minLength(10)]),
    img: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required,Validators.pattern('[\\w\\sáéíóúÁÉÍÓÚüÜñÑ,%().-]*'), Validators.minLength(3)]),
  });

  constructor() { }

  ngOnInit() {
    this.getCurrentUser();
    console.log(this._location.getState());
    this.news = (this._location.getState() as any).news as News;
    if (this.news) this.setCurrentNews(this.news);
  }

  setCurrentNews(News: any) {
    this.formEditNews.patchValue(this.news);
  }


  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  updateNews() {
    const storage = getStorage();
    const newsData: News = {
      id: this.news.id,
      description: this.formEditNews.get('description')!.value as string,
      img: this.news.img, // Mantén la imagen existente si no se selecciona una nueva imagen
      title: this.formEditNews.get('title')!.value as string,
    };

    if (this.selectedImage) {
      const fileName = `${new Date().getTime()}_${this.selectedImage.name}`;
      const fileRef = ref(storage, fileName);

      uploadBytes(fileRef, this.selectedImage).then(() => {
        getDownloadURL(fileRef).then((imageUrl) => {
          newsData.img = imageUrl; // Asigna la nueva URL de descarga al campo "img" del objeto newsData

          this.updateNewsData(newsData);
        });
      });
    } else {
      this.updateNewsData(newsData);
    }
  }

  updateNewsData(newsData: News) {
    this._newsService.updateNews(newsData).then(() => {
      this._router.navigate(['crud-noticias']);
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
