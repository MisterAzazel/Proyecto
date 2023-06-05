import { NewsService } from './../services/news.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { News } from '../commons/interfaces/user.interface';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.page.html',
  styleUrls: ['./noticias.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NoticiasPage implements OnInit {

  _newsService = inject(NewsService);
  news: News[] = [];
  _router= inject(Router);
  _userService = inject(UsersService);
  isAdmin = false;
  isLoggedIn = false;
  isFinalUser = false;

  constructor() { }

  ngOnInit() {
    this.loadNews();
    this.getCurrentUser();
  }

  loadNews(){
    this._newsService.getNews().subscribe( res =>{
      this.news = res;
    }

    )
  }

  getNews(news: News) {
    this._router.navigateByUrl('detalle-noticia', { state: { news } });
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
