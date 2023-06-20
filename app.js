const express = require('express');
const pdfMakePrinter = require('pdfmake/src/printer');
const fs = require('fs');

const app = express();

// ... Resto de tu código ...

app.get('/boleta', (req, res) => {
  const nombre = 'John'; // Reemplaza con el nombre correspondiente
  const objetos = [{ nombre: 'Producto 1', precio: 10 }, { nombre: 'Producto 2', precio: 20 }]; // Reemplaza con los datos correspondientes
  const total = 30; // Reemplaza con el total correspondiente

  const fonts = {
    Roboto: {
      normal: 'node_modules/pdfmake/fonts/Roboto/Roboto-Regular.ttf',
      bold: 'node_modules/pdfmake/fonts/Roboto/Roboto-Bold.ttf',
      italics: 'node_modules/pdfmake/fonts/Roboto/Roboto-Italic.ttf',
      bolditalics: 'node_modules/pdfmake/fonts/Roboto/Roboto-BoldItalic.ttf',
    },
  };

  const printer = new pdfMakePrinter(fonts);

  const docDefinition = {
    content: [
      { text: 'Boleta de Compra', style: 'header' },
      { text: 'Cliente: ' + nombre, style: 'subheader' },
      'Productos:',
      {
        ul: objetos.map((producto) => `${producto.nombre} - $${producto.precio}`),
      },
      { text: 'Total a Pagar: $' + total, style: 'subheader' },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  const filePath = 'descargas/boleta.pdf'; // Cambia la ruta y el nombre del archivo según tus necesidades
  const writeStream = fs.createWriteStream(filePath);
  pdfDoc.pipe(writeStream);
  pdfDoc.end();

  writeStream.on('finish', () => {
    res.download(filePath, 'boleta.pdf'); // Envía el archivo PDF como descarga al cliente
  });
});

app.listen(3001, () => {
  console.log('Servidor iniciado en el puerto 3001');
});