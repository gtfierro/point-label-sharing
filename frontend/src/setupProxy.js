const proxy = require('http-proxy-middleware');

module.exports = (app) => {
    console.log("PROXYYY");
    app.use(proxy('/file', { target: 'http://localhost:5000' }));
};