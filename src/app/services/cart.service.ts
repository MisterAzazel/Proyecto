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
    if (product.stock < compra || compra <= 0 || compra == null) {
      alert('No puedes comprar más productos de los que hay, o comprar menos de 1');
    } else {
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
  
      // Obtener el array de productos del sessionStorage
      let cartProducts = sessionStorage.getItem('cartProducts');
      let productsArray = [];
  
      if (cartProducts !== null) {
        productsArray = JSON.parse(cartProducts);
      }
  
      // Buscar si el objeto ya existe en el array por su id
      let existingProductIndex = productsArray.findIndex((item: Product) => item.id === obj.id);
  
      if (existingProductIndex !== -1) {
        // Si el objeto ya existe, reemplazarlo en el array
        productsArray[existingProductIndex] = obj;
      } else {
        // Si el objeto no existe, agregarlo al array
        productsArray.push(obj);
      }
  
      // Guardar el array actualizado en el sessionStorage
      sessionStorage.setItem('cartProducts', JSON.stringify(productsArray));
      console.log(sessionStorage.getItem('cartProducts'));
    }
  }

  Delete(id: string) {
    let cartProducts = sessionStorage.getItem('cartProducts');
    let productsArray = [];
  
    if (cartProducts !== null) {
      productsArray = JSON.parse(cartProducts);
    }
  
    // Buscar el índice del producto en el array por su id
    let productIndex = productsArray.findIndex((item: Product) => item.id === id);
  
    if (productIndex !== -1) {
      // Si se encontró el producto, eliminarlo del array
      productsArray.splice(productIndex, 1);
  
      // Guardar el array actualizado en el sessionStorage
      sessionStorage.setItem('cartProducts', JSON.stringify(productsArray));
      console.log(sessionStorage.getItem('cartProducts'));
    }
  }


  Save(Nombre: string) {
    sessionStorage.setItem(Nombre, JSON.stringify(this.cartProducts));
  }
  
}
