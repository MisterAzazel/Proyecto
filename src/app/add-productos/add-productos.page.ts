import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ProductsService } from '../services/products.service';
import { Product } from '../commons/interfaces/user.interface';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

@Component({
  selector: 'app-add-productos',
  templateUrl: './add-productos.page.html',
  styleUrls: ['./add-productos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddProductosPage implements OnInit {

  _userService = inject(UsersService);
  isAdmin = false;
  isLoggedIn = false;
  isFinalUser = false;
  _router = inject(Router);
  _productsService = inject(ProductsService)
  selectedImage: File | null = null;

  constructor() { }

  ngOnInit() {
    this.getCurrentUser();
  }

  formProduct = new FormGroup({
    category: new FormControl('', [Validators.required,Validators.pattern('[\\w\\sáéíóúÁÉÍÓÚüÜñÑ,%().-]*'), Validators.minLength(2)]),
    description: new FormControl('', [Validators.required,Validators.pattern('[\\w\\sáéíóúÁÉÍÓÚüÜñÑ,%().-]*'), Validators.minLength(10)]),
    name: new FormControl('', [Validators.required,Validators.pattern('[\\w\\sáéíóúÁÉÍÓÚüÜñÑ,%().-]*'), Validators.minLength(3)]),
    img: new FormControl('', [Validators.required]),
    price: new FormControl(1, [Validators.required,Validators.pattern('[0-9]*'), Validators.minLength(1)]),
    stock: new FormControl(2, [Validators.required,Validators.pattern('[0-9]*'), Validators.minLength(1)]),
    destacado: new FormControl(false, [Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+'), Validators.minLength(2)]),
  });

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  addProduct() {
    const storage = getStorage();

    if (this.selectedImage) {
      const fileName = `${new Date().getTime()}_${this.selectedImage.name}`;
      const fileRef = ref(storage, fileName);

      uploadBytes(fileRef, this.selectedImage).then(() => {
        // Obtiene la URL de descarga de la imagen subida
        getDownloadURL(fileRef).then((imageUrl) => {
          // Crea un objeto con los datos del producto
          const productData: Product = {
            id: new Date().getTime().toString(),
            category: this.formProduct.get('category')!.value as string,
            description: this.formProduct.get('description')!.value as string,
            img: imageUrl, // Asigna directamente la URL de descarga al campo "img" del objeto productData
            name: this.formProduct.get('name')!.value as string,
            price: this.formProduct.get('price')!.value as number,
            stock: this.formProduct.get('stock')!.value as number,
            imageUrl: imageUrl,
            destacado: this.formProduct.get('destacado')!.value as boolean,
          };

          // Guarda el producto en Firestore
          this._productsService.addProduct(productData).then(() => {
            this._router.navigate(['crud-productos']);
          });
        });
      });
    } else {
      console.log("Inserta una imagen");
    }
  }

  getCurrentUser(){
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    this.isLoggedIn = true;
    const email = user.email;
    this.getUserDataByEmail(email);
  }
  // ...
  else {
    this.isLoggedIn = false;
    // User is signed out
    // ...
  }

});
  }

getUserDataByEmail(email: any) {

// Obtiene una referencia a la instancia de Firestore
const db = getFirestore();
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    return getDocs(q)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log('ID:', doc.id); // ID del documento
        console.log('Data:', doc.data()); // Todos los datos del documento
        if (doc.data()['role']['admin'] === true) {
          this.isAdmin = true;
        }

        else if (doc.data()['role']['final'] == true){
          this.isFinalUser = true;
        }

        else{
          this.isAdmin = false;
          this.isFinalUser = false;
        }


    });
    })
    .catch((error) => {
      console.error('Error al obtener los datos:', error);
    });
  }

  logOut(){
    this._userService.logOut()
    .then(() => {
      this._router.navigate(['/']);
    })
    .catch(error => console.log(error));
  }

}
