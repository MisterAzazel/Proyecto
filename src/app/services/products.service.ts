import { User, Product } from './../commons/interfaces/user.interface';
import { Injectable } from '@angular/core';
import { Firestore, addDoc, query, where,collectionData, } from '@angular/fire/firestore'
import {collection} from '@firebase/firestore';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private firestore : Firestore, private auth: Auth) { }

  getProduct(filter = ''){
    const productRef = collection(this.firestore, 'products');
    let q = query(productRef);
    if (filter) {
      q = query(productRef, where('name', '==', filter));
    }
    return collectionData(q) as unknown as Observable<Product[]>;
  }

}
