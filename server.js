// Importar los módulos necesarios
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Configurar el servidor backend
const app = express();
const port = 3000;

// Configurar los middleware de CORS
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST'],
}));

// Configurar el proxy para redirigir las solicitudes a la API de Transbank
const proxyOptions = {
  target: 'https://webpay3gint.transbank.cl',
  changeOrigin: true,
};

app.use('/api/webpay/v1.3/transactions', createProxyMiddleware(proxyOptions));

// Ruta para recibir las solicitudes desde el frontend
app.post('/api/webpay/v1.3/transactions', (req, res) => {
  // Obtener los datos del token y la URL desde el cuerpo de la solicitud
  const { token, url } = req.body;

  // Aquí puedes realizar cualquier procesamiento adicional con los datos recibidos
  // ...

  // Agregar la cabecera Access-Control-Allow-Origin en la respuesta
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Enviar una respuesta al frontend (opcional)
  res.json({ success: true });
});

// Iniciar el servidor backend
app.listen(port, () => {
  console.log(`Servidor backend en ejecución en http://localhost:${port}`);
});