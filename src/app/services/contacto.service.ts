import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collectionData, query } from '@angular/fire/firestore';
import { collection, doc, getDocs, updateDoc, where } from 'firebase/firestore';
import { registroContacto } from '../commons/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  constructor(private firestore : Firestore, private auth: Auth) { }

  getRegistroContacto(filter = ''){
    const registroContactoRef = collection(this.firestore, 'registroContacto');
    let q = query(registroContactoRef);
    if (filter) {
      q = query(registroContactoRef, where('email', '==', filter));
    }
    return collectionData(q) as unknown as Observable<registroContacto[]>;
  }

  async updateRegistroContacto(registroContacto: registroContacto) {
    const registroContactoRef = collection(this.firestore, 'registroContacto');
    let q = query(registroContactoRef, where('id', '==', registroContacto.id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (document) => {
      const docRef = doc(this.firestore, 'registroContacto', document.id);
      await updateDoc(docRef, { ...registroContacto });
    });
  }

}
