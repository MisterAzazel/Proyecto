import { User, Product } from './../commons/interfaces/user.interface';
import { Injectable } from '@angular/core';
import { Firestore, addDoc, query, where,collectionData, deleteDoc, doc, getDocs, updateDoc, } from '@angular/fire/firestore'
import {collection} from '@firebase/firestore';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private firestore : Firestore, private auth: Auth) { }


  addProduct(product: Product) {
    const productRef = collection(this.firestore, 'products');
    return addDoc(productRef, product);
  }

  getProduct(filter = ''){
    const productRef = collection(this.firestore, 'products');
    let q = query(productRef);
    if (filter) {
      q = query(productRef, where('category', '==', filter));
    }
    return collectionData(q) as unknown as Observable<Product[]>;
  }

  getDestacadoProduct(filter: string){
    const productRef = collection(this.firestore, 'products');
    let q = query(productRef);
    if (filter) {
      q = query(productRef, where('destacado', '==', filter));
    }
    return collectionData(q) as unknown as Observable<Product[]>;
  }

  async updateProduct(product: Product) {
    const productsRef = collection(this.firestore, 'products');
    let q = query(productsRef, where('id', '==', product.id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (document) => {
      const docRef = doc(this.firestore, 'products', document.id);
      await updateDoc(docRef, { ...product});
    });
  }
  
  async deleteProduct(id: string){
    const productRef = collection(this.firestore, 'products');
    let q = query(productRef, where('id', '==', id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (document) => {
      const docRef = doc(this.firestore, 'products', document.id);
      deleteDoc(docRef);
    });
  }

}
