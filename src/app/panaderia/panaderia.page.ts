import { Product } from './../commons/interfaces/user.interface';
import { CartService } from './../services/cart.service';
import { ProductsService } from './../services/products.service';
import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-panaderia',
  templateUrl: './panaderia.page.html',
  styleUrls: ['./panaderia.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PanaderiaPage implements OnInit {

  product$!: Observable<Product[]>;

  products: Product[] = [];
 

  _productService = inject(ProductsService);
  _cartService = inject(CartService)

  constructor() { 
    this.loadProducto();
  }

  ngOnInit(): void {
    //this.product$ = this._productService.getProduct();
  }

  loadProducto(){
    this._productService.getProduct().subscribe( res =>{
      this.products = res;
    }

    )
  }

  addCart(product: Product){
    this._cartService.addProduct(product)
  }

}
