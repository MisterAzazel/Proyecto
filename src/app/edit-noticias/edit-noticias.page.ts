import { News } from './../commons/interfaces/user.interface';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NewsService } from '../services/news.service';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
  
  formEditNews = new FormGroup({
    description: new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+'), Validators.minLength(10)]),
    img: new FormControl('', [Validators.required, Validators.minLength(4)]),
    title: new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
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


  updateNews() {
    console.log({
      id: this.news.id,
      ...this.formEditNews.getRawValue(),
    });

    this._newsService.updateNews({
      id: this.news.id,
      ...this.formEditNews.getRawValue(),
    } as News);
    this._router.navigate(['crud-noticias']);
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
