const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors'); // Importa el middleware cors

const app = express();

app.use(cors()); // Agrega el middleware cors a la aplicación

// Configura el proxy inverso para redirigir las solicitudes a tu servidor
app.use(createProxyMiddleware({
  target: 'https://webpay3gint.transbank.cl',
  changeOrigin: true,
  secure: false,
}));

// Configura otras rutas de tu aplicación
// ...

// Inicia el servidor en el puerto deseado
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor proxy iniciado en el puerto ${port}`);
});