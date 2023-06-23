import { User, Product, Compras } from './../commons/interfaces/user.interface';
import { Injectable } from '@angular/core';
import { Firestore, addDoc, query, where,collectionData, deleteDoc, doc, getDocs, updateDoc, } from '@angular/fire/firestore'
import {collection} from '@firebase/firestore';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from '@angular/fire/auth';
import { BehaviorSubject, Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  constructor(private firestore : Firestore, private auth: Auth) { }

  getCompras(filter = ''): Observable<Compras[]> {
    const comprastRef = collection(this.firestore, 'compras');
    let q = query(comprastRef);
    if (filter) {
      q = query(comprastRef, where('email_comprador', '==', filter));
    }
    return collectionData(q).pipe(
      map((data: Compras[]) => {
        return data.map(compra => ({
          ...compra,
          productos: Object.values(compra.productos)
        }));
      })
    );
  }

  async updateCompras(compras: Compras) {
    const registroContactoRef = collection(this.firestore, 'compras');
    let q = query(registroContactoRef, where('orden_compra', '==', compras.orden_compra));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (document) => {
      const docRef = doc(this.firestore, 'compras', document.id);
      await updateDoc(docRef, { ...compras });
    });
  }
}
