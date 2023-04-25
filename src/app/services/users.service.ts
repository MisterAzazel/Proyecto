import { User, Product } from './../commons/interfaces/user.interface';
import { Injectable } from '@angular/core';
import { Firestore, addDoc, query, where,collectionData, } from '@angular/fire/firestore'
import {collection} from '@firebase/firestore';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
;


  constructor(private firestore : Firestore, private auth: Auth) {}

  
    addUser(user: User) {
      const userRef = collection(this.firestore, 'users');
      return addDoc(userRef, user);
    }

    register({email, password}: any){
      return createUserWithEmailAndPassword(this.auth, email, password)
    }

    getUser(filter = ''){
      const userRef = collection(this.firestore, 'users');
      let q = query(userRef);
      if (filter) {
        q = query(userRef, where('name', '==', filter));
      }
      return collectionData(q);
    }

    login({email, password}: any){
      return signInWithEmailAndPassword(this.auth, email, password);
    }

    logOut(){
      return signOut(this.auth);
    }

    
   
}
