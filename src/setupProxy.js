const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://10.124.69.230:32153',
      changeOrigin: true,
      secure: false
    })
  );
};