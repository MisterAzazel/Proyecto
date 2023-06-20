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
// Ruta para enviar el correo utilizando SendGrid
app.post('/send-email', (req, res) => {
  const emailData = {
    personalizations: [
      {
        to: [{ email: 'josue20650@example.com' }]
      }
    ],
    from: { email: 'makotomistwalker@example.com' },
    subject: 'Hello from SendGrid',
    content: [
      {
        type: 'text/plain',
        value: 'This is a test email from SendGrid.'
      }
    ]
  };

  axios.post('https://api.sendgrid.com/v3/mail/send', emailData, {
    headers: {
      Authorization: `Bearer YOUR_SENDGRID_API_KEY`
    }
  })
    .then(response => {
      console.log('Correo enviado:', response.data);
      res.status(200).json({ message: 'Correo enviado correctamente' });
    })
    .catch(error => {
      console.error('Error al enviar el correo:', error);
      res.status(500).json({ message: 'Error al enviar el correo' });
    });
});
// Inicia el servidor en el puerto deseado
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor proxy iniciado en el puerto ${port}`);
});