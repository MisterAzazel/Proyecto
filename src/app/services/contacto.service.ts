import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collectionData, query } from '@angular/fire/firestore';
import { collection, where } from 'firebase/firestore';
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
}
