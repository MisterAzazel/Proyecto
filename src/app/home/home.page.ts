import { UsersService } from './../services/users.service';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
})

export class HomePage implements OnInit{
  _userService = inject(UsersService);
  searcher = new FormControl('');

  
  
  //constructor() {}

  ngOnInit() {
      this._userService.getUser().subscribe((res) => console.log(res));
  }
}
