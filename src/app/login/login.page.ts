import { Router } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersService } from '../services/users.service';
import { error } from 'console';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {

  formLogin : FormGroup;
  private _router = inject(Router);

  constructor( private userService: UsersService) {
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), Validators.minLength(10)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    })
   }

  ngOnInit() {
  }

  login(){
    this.userService.login(this.formLogin.value)
    .then(response =>{

      console.log(response);
    })
    .catch(error => console.log(error));
  }

  logOut(){
    this.userService.logOut()
    .then(() => {
      this._router.navigate(['/home']);
    })
    .catch(error => console.log(error));
  }
}
