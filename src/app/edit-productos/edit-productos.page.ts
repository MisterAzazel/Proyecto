import { Router } from '@angular/router';
import { Product } from './../commons/interfaces/user.interface';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductsService } from '../services/products.service';
import { UsersService } from '../services/users.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject  } from 'firebase/storage';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

@Component({
  selector: 'app-edit-productos',
  templateUrl: './edit-productos.page.html',
  styleUrls: ['./edit-productos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})

export class EditProductosPage implements OnInit {
  _productsService = inject(ProductsService);
  _location = inject(Location);
  product!: Product;
  _router= inject(Router);
  _userService = inject(UsersService);
  isAdmin = false;
  isLoggedIn = false;
  isFinalUser = false;
  selectedImage: File | null = null;


  formEditProduct = new FormGroup({
    category: new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+'), Validators.minLength(2)]),
    description: new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+'), Validators.minLength(10)]),
    name: new FormControl('', [Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
    img: new FormControl('', [Validators.required]),
    price: new FormControl(1, [Validators.required,Validators.pattern('[0-9]*'), Validators.minLength(1)]),
    stock: new FormControl(2, [Validators.required,Validators.pattern('[0-9]*'), Validators.minLength(1)]),
    destacado: new FormControl(false, [Validators.required,Validators.pattern('[a-zA-Z][a-zA-Z ]+'), Validators.minLength(2)]),
  });

  constructor() { }

  ngOnInit() {
    this.getCurrentUser();
    console.log(this._location.getState());
    this.product = (this._location.getState() as any).product as Product;
    if (this.product) this.setCurrentProduct(this.product);
  }

  setCurrentProduct(Product: any) {
    this.formEditProduct.patchValue(this.product);
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }


  updateProducts() {
    const storage = getStorage();
    const productData: Product = {
      id: this.product.id,
      category: this.formEditProduct.get('category')!.value as string,
      description: this.formEditProduct.get('description')!.value as string,
      name: this.formEditProduct.get('name')!.value as string,
      price: this.formEditProduct.get('price')!.value as number,
      stock: this.formEditProduct.get('stock')!.value as number,
      img: this.product.imageUrl, // Mantén la imagen existente si no se selecciona una nueva imagen
      imageUrl: this.product.imageUrl, // Mantén la imagen existente si no se selecciona una nueva imagen
      destacado: this.formEditProduct.get('destacado')!.value as boolean,
    };

    if (this.selectedImage) {
      const fileName = `${new Date().getTime()}_${this.selectedImage.name}`;
      const fileRef = ref(storage, fileName);

      uploadBytes(fileRef, this.selectedImage).then(() => {
        getDownloadURL(fileRef).then((imageUrl) => {
          productData.img = imageUrl; // Asigna la nueva URL de descarga al campo "img" del objeto productData
          productData.imageUrl = imageUrl; // Actualiza la URL de imagen en el objeto productData

          this.updateProductData(productData);
        });
      });
    } else {
      this.updateProductData(productData);
    }
  }

  updateProductData(productData: Product) {
    this._productsService.updateProduct(productData).then(() => {
      this._router.navigate(['crud-productos']);
    });
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
      this._router.navigate(['reload']);
    })
    .catch(error => console.log(error));
  }

}
