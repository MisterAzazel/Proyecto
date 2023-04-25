import { UsersService } from './../services/users.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { User } from '../commons/interfaces/user.interface';
import { error } from 'console';

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
    } as User);
    this._router.navigate(['login']);
  }
}