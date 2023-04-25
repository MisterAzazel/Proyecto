import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-pasteleria',
  templateUrl: './pasteleria.page.html',
  styleUrls: ['./pasteleria.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PasteleriaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
