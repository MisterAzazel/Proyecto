import { News } from './../commons/interfaces/user.interface';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, collectionData, deleteDoc, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { addDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private firestore : Firestore, private auth: Auth) { }


  addNews(news: News) {
    const newsRef = collection(this.firestore, 'news');
    return addDoc(newsRef, news);
  }

  getNews(filter = ''){
    const newsRef = collection(this.firestore, 'news');
    let q = query(newsRef);
    if (filter) {
      q = query(newsRef, where('title', '==', filter));
    }
    return collectionData(q) as unknown as Observable<News[]>;
  }

  async updateNews(news: News) {
    const newsRef = collection(this.firestore, 'news');
    let q = query(newsRef, where('id', '==', news.id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (document) => {
      const docRef = doc(this.firestore, 'news', document.id);
      await updateDoc(docRef, { ...news });
    });
  }
  
  async deleteNews(id: string){
    const newsRef = collection(this.firestore, 'news');
    let q = query(newsRef, where('id', '==', id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (document) => {
      const docRef = doc(this.firestore, 'news', document.id);
      deleteDoc(docRef);
    });
  }

}
