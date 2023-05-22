import { Injectable } from '@angular/core';
import { Product } from '../commons/interfaces/user.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartProducts: any[] = [];
  compra: number = 0;

  private _products: BehaviorSubject<Product[]>;

  constructor() { 
   this._products = new BehaviorSubject<Product[]>([]);
  }

  Add(product: Product, compra: number) {
    let obj = {
      nombre_producto: product.name,
      id: product.id,
      category: product.category,
      description: product.description,
      price: product.price,
      compra: compra,
      stock: product.stock,
      img: product.img,
    };
    this.cartProducts.push(obj);
    this.Save();
    console.log(sessionStorage.getItem("Producto"));
  }

  

  Delete(index: number) {
    if (this.cartProducts.length > index) {
      this.cartProducts.splice(index, 1);
      this.Save();
    }
  }

  DeleteAll() {
    this.cartProducts = [];
    this.Save();
  }

  Save() {
    sessionStorage.setItem("Producto", JSON.stringify(this.cartProducts));
  }


  
}
