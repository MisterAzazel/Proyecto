import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersService } from '../services/users.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { Product } from '../commons/interfaces/user.interface';
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';
import axios from 'axios';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule]
})
export class CarritoPage implements OnInit {

  _userService = inject(UsersService);
  isAdmin = false;
  isLoggedIn = false;
  isFinalUser = false;
  _router = inject(Router);
  cartProducts: any[] = [];
  _cartService= inject(CartService);
  objetos: any[] = [];
  precio_total: number = 0;
  email: string = '';
  nombre: string = '';
  apellido: string= '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    setTimeout(() => {

    }, 1000);
    this.getCurrentUser();
    this.GetAll();
    this.calcularPrecioTotal();
    const transactionToken = localStorage.getItem('transactionToken');
    const orderNumber = localStorage.getItem('orderNumber');
    if (transactionToken) {
    alert("Esperando datos de la transacción, espere por favor")
    setTimeout(() => {
        this.confirmarTransaccion(transactionToken, orderNumber);
        localStorage.removeItem('transactionToken');
        localStorage.removeItem('orderNumber');
    }, 2000);
    }
  }



  calcularPrecioTotal() {
    this.precio_total = 0; // Reinicia el valor a cero

    for (const arr of this.objetos) {
      for (const objeto of arr) {
        this.precio_total += objeto.price * objeto.compra;
      }
    }
  }




  GetAll() {
    // Obtener todas las claves del sessionStorage
  const keys = Object.keys(sessionStorage);

  // Array para almacenar los objetos recuperados
   this.objetos = [];

  // Iterar sobre las claves y obtener los objetos correspondientes
  for (const key of keys) {
    const value = sessionStorage.getItem(key);

  if (value !== null) {
    const objeto = JSON.parse(value);
    this.objetos.push(objeto);
    console.log(this.objetos);
    }
  }
}



guardarDatosEnFirebase(token: string, orderNumber: string) {
  const db = getFirestore();
  const docRef = collection(db, 'compras');

  // Convertir this.objetos a un objeto plano
  const productos = this.objetos.reduce((obj, arr) => {
    arr.forEach((objeto: any) => {  // Especifica el tipo de datos de objeto
      obj[objeto.nombre_producto] = objeto;
    });
    return obj;
  }, {});

  const data = {
    orden_compra: orderNumber,
    token: token,
    email_comprador: this.email,
    nombre_comprador: this.nombre,
    apellido_comprador: this.apellido,
    productos: productos,
    precio_total: this.precio_total,
    fecha: new Date().toLocaleDateString(),
    estado: 'Completado',
  };

  addDoc(docRef, data)
    .then((docRef) => {
      console.log('Datos guardados en Firebase:', docRef.id);
      setTimeout(() => {
        this.borrarTodo()
      }, 3000);
    })
    .catch((error) => {
      console.error('Error al guardar datos en Firebase:', error);
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
        this.email = doc.data()['email'];
        this.nombre = doc.data()['name'];
        this.apellido = doc.data()['lastName'];
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

generarPDF(orderNumber: string) {
  // Obtener la fecha actual
  const fechaActual = new Date().toLocaleDateString();

  // Mapear los objetos para generar la lista de productos
  const productList = this.objetos.reduce((result: any[], arr: any[]) => {
    return result.concat(
      arr.map((objeto: any) => [
        { text: objeto.nombre_producto, alignment: 'center' },
        { text: objeto.compra.toString(), alignment: 'center' },
        { text: '$' + objeto.price, alignment: 'center' },
        { text: '$' + (objeto.price * objeto.compra), alignment: 'center' }
      ])
    );
  }, []);

  // Agregar el precio total al final de la lista de productos
  productList.push(['', '', '', { text: 'Total a Pagar: $' + this.precio_total, alignment: 'center' }]);

  // Configuración del documento PDF
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const docDefinition = {
    content: [
      // Título de la panadería
      { text: 'Olivia Panadería y Pastelería Saludable', style: 'titulo' },

      // Nombre del cliente
      { text: 'Cliente: ' + this.nombre + ' ' + this.apellido, style: 'clienteHeader' },

      // Orden de compra y fecha actual
      {
        columns: [
          { text: 'Orden de Compra: ' + orderNumber, style: 'ordenCompra' },
          { text: 'Fecha: ' + fechaActual, style: 'fecha' }
        ]
      },

      // Tabla de productos
      {
        style: 'tablaProductos',
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto', 'auto'],
          body: [
            // Encabezados de la tabla
            ['Nombre del Producto', 'Cantidad', 'Precio Unitario', 'Precio Total'],

            // Filas de productos
            ...productList
          ]
        }
      }
    ],
    styles: {
      titulo: {
        fontSize: 24,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 20] // Margen inferior de 20 unidades
      },
      clienteHeader: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10] // Margen inferior de 10 unidades
      },
      ordenCompra: {
        fontSize: 12,
        bold: true
      },
      fecha: {
        fontSize: 12,
        margin: [10, 0, 0, 0] // Margen izquierdo de 10 unidades
      },
      tablaProductos: {
        margin: [0, 10, 0, 20] // Margen inferior de 20 unidades
      }
    }
  };

  // Generar el PDF
  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  pdfDocGenerator.download('boleta.pdf');
}

createAndSubmitForm(url: string, token: string) {
  const form = document.createElement('form');
  form.action = url;
  form.method = 'POST';

  const tokenInput = document.createElement('input');
  tokenInput.type = 'hidden';
  tokenInput.name = 'token_ws';
  tokenInput.value = token;

  form.appendChild(tokenInput);
  document.body.appendChild(form);
  form.submit();
}



realizarSolicitud() {
  if (this.isLoggedIn == false) {
    alert('Tienes que iniciar sesión para proceder al pago');
  } else {
    const url = 'http://localhost:3000/rswebpaytransaction/api/webpay/v1.3/transactions';
    const orderNumber = Math.floor(10000000 + Math.random() * 90000000);

    const headers = {
      'Content-Type': 'application/json',
      'Tbk-Api-Key-Id': '597055555532',
      'Tbk-Api-Key-Secret': '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'
    };

    const hostName = window.location.hostname;
    let returnUrl = '/carrito'; // Valor predeterminado para localhost

    if (hostName === 'localhost') {
      returnUrl = 'http://localhost:4200/carrito';
    }

    if (hostName === 'proyecto-duoc.web.app') {
      returnUrl = 'https://proyecto-duoc.web.app/carrito';
    }

    const datosDeCompra = {
      "buy_order": orderNumber,
      "session_id": "sesion1234557545",
      "amount": this.precio_total,
      "return_url": returnUrl,
    };

    axios.post(url, datosDeCompra, { headers: headers })
      .then(response => {
        console.log('Respuesta:', response.data);
        const { url, token } = response.data; // Obtener la URL y el token de la respuesta

        localStorage.setItem('transactionToken', token);
        localStorage.setItem('orderNumber', orderNumber.toString())
        // Llamar a la función para crear y enviar el formulario automáticamente
        this.createAndSubmitForm(url, token);
      })
      .catch(error => {
        console.error('Error:', error);
        console.log("Error:", error.response?.data);
      });
  }
}

confirmarTransaccion(token: string, orderNumber: string) {
    const url = `http://localhost:3000/rswebpaytransaction/api/webpay/v1.3/transactions/${token}`;

    const headers = {
      'Content-Type': 'application/json',
      'Tbk-Api-Key-Id': '597055555532',
      'Tbk-Api-Key-Secret': '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'
    };

    axios.put(url, {}, { headers: headers })
      .then(response => {
        console.log('Respuesta de confirmación:', response.data);
        const status = response.data.status;
        if (status === 'AUTHORIZED') {
          alert('Su transacción ha sido autorizada, su boleta se descargara automaticamente, si esta no se descarga automaticamente vaya a la sección "compras", si no esta ahi su compra comuniquese en "contacto"')
          this.generarPDF(orderNumber);
          this.guardarDatosEnFirebase(token, orderNumber);
        } else {

         alert("Su transacción no ha sido autorizada o ha sido cancelada")
          console.log('La transacción no fue autorizada.');
        }
      })
      .catch(error => {

        alert("Su transacción no ha sido autorizada o ha sido cancelada")
        console.error('Error al confirmar la transacción:', error);
      });
  }



  logOut(){
    this._userService.logOut()
    .then(() => {
      this._router.navigate(['/']);
    })
    .catch(error => console.log(error));
  }

  borrar(nombre: string){
    this._cartService.Delete(nombre);
    this.GetAll();
    this.calcularPrecioTotal();
  }

  borrarTodo(){
    sessionStorage.clear();
    this.GetAll();
    this.calcularPrecioTotal();
  }


}



