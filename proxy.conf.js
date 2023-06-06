const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://webpay3gint.transbank.cl',
      secure: true,
      changeOrigin: true
    })
  );
};