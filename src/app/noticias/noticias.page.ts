import { NewsService } from './../services/news.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { News } from '../commons/interfaces/user.interface';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
