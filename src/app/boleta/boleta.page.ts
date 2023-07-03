import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { ComprasService } from '../services/compras.service';
import { Compras, Productos } from '../commons/interfaces/user.interface';
import { map } from 'rxjs';
import axios from 'axios';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-boleta',
  templateUrl: './boleta.page.html',
  styleUrls: ['./boleta.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BoletaPage implements OnInit {

  _userService = inject(UsersService);
  _compras = inject(ComprasService);
  isAdmin = false;
  isLoggedIn = false;
  isFinalUser = false;
  _router = inject(Router);
  email: string = '';
  nombre: string = '';
  apellido: string= '';
  objetos: any[] = [];
  compras: Compras[] = [];
  total: number = 0;

  constructor() { }

  ngOnInit() {
    this.getCurrentUser();
    setTimeout(() => {
      if(this.isFinalUser == true || this.isAdmin == true){
        this.loadCompras();
      }
      else{
        this.loadComprasCorreo(this.email);
      }
    }, 2000);

  }



  getCurrentUser() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        this.isLoggedIn = true;
        const email = user.email;
        this.getUserDataByEmail(email).then(() => {
        });
      } else {
        this.isLoggedIn = false;
        // User is signed out
        // ...
      }
    });
  }

  async reembolsarCompra(ordenCompra: string) {
    const compras: Partial<Compras> = { orden_compra: ordenCompra, estado: 'Reembolsado' };
    await this._compras.updateCompras(compras as Compras);
  }


  loadCompras() {
    this._compras.getCompras().pipe(
      map(res => res.filter(compra => !!compra)) // Filtra las compras nulas o indefinidas
    ).subscribe(res => {
      this.compras = res;
      console.log(this.compras);
    });
  }

  loadComprasCorreo(email: string){
    this._compras.getCompras(email).pipe(
      map(res => res.filter(compra => !!compra)) // Filtra las compras nulas o indefinidas
    ).subscribe(res => {
      this.compras = res;
      console.log(this.compras);
    });
  }

  cancelarCompra(token: string, amount: number, orden_compra: string) {
    if(confirm(`Seguro que quieres reembolsar esta compra?`)){
      const url = `http://localhost:3000/rswebpaytransaction/api/webpay/v1.3/transactions/${token}`;

    const headers = {
      'Content-Type': 'application/json',
      'Tbk-Api-Key-Id': '597055555532',
      'Tbk-Api-Key-Secret': '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'
    };

    const datosDeCancelacion = {
      token: token,
      amount: amount
    };

    axios.put(url, datosDeCancelacion, { headers: headers })
    .then(response => {
      console.log('Reembolso', response.data)
      this.reembolsarCompra(orden_compra);
      // Manejar la respuesta según tus necesidades
    })
    .catch(error => {
      console.error('Error:', error);
      console.log('Error:', error.response?.data);
      // Manejar el error según tus necesidades
    });
  }
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

    // Obtener el nombre y apellido del comprador
    const nombreComprador = this.compras.find((compra: any) => compra.orden_compra === orderNumber)?.nombre_comprador;
    const apellidoComprador = this.compras.find((compra: any) => compra.orden_compra === orderNumber)?.apellido_comprador;

    // Obtener la lista de productos de la orden de compra
    const productList = this.compras.find((compra: any) => compra.orden_compra === orderNumber)?.productos.map((producto: any) => [
      { text: producto.nombre_producto, alignment: 'center' },
      { text: producto.compra.toString(), alignment: 'center' },
      { text: '$' + producto.price, alignment: 'center' },
      { text: '$' + (producto.price * producto.compra), alignment: 'center' }
    ]);

    // Obtener el precio total de la orden de compra
    const precioTotal = this.compras.find((compra: any) => compra.orden_compra === orderNumber)?.precio_total;

    // Configuración del documento PDF
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const docDefinition = {
      content: [
        // Título de la panadería
        { text: 'Olivia Panadería y Pastelería Saludable', style: 'titulo' },

        // Nombre del cliente
        { text: 'Cliente: ' + nombreComprador + ' ' + apellidoComprador, style: 'clienteHeader' },

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
              ...productList,

              // Precio total
              ['', '', '', { text: 'Total a Pagar: $' + precioTotal, alignment: 'center' }]
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



  logOut(){
    this._userService.logOut()
    .then(() => {
      this._router.navigate(['/']);
    })
    .catch(error => console.log(error));
  }
}