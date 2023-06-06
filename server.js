const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { WebpayPlus, Options, Environment, IntegrationCommerceCodes, IntegrationApiKeys } = require('transbank-sdk');

const app = express();
app.use(cors());

app.post('/api/token', (request, response) => {
  const headers = {
    'Content-Type': 'application/json',
    'Tbk-Api-Key-Id': '597055555532',
    'Tbk-Api-Key-Secret': '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
  };

  const url = 'https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.0/transactions';
  
  const datosDeCompra = {
    buy_order: 'ordenCompra12345678',
    session_id: 'sesion1234557545',
    amount: 10000,
    return_url: '/carrito',
  };

  axios
    .post(url, datosDeCompra, { headers })
    .then(r => {
      console.log('data => ', r.data);
      const token = r.data.token;
      const url = r.data.url;

      // Aquí puedes hacer lo que necesites con el token y la URL, como guardarlos en la base de datos, enviarlos al cliente, etc.

      // Resto de tu código...
      return response.send(r.data);
    })
    .catch(e => {
      console.log('error =>', e.response.data);
      return response.status(500).send(e.response.data);
    });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});