var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

var r_reports = require('./routes/reports');
var r_views = require('./routes/views');
var r_login = require('./routes/login')
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
var publicPath = path.join(__dirname, './client'); //path.join(__dirname, 'public'); también puede ser una opción
var publicImages = path.join(__dirname, './client/production/images');
// Para que los archivos estaticos queden disponibles.
app.use(express.static(publicPath));
app.use(express.static(publicImages));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(r_reports);
app.use(r_views);
app.use(r_login)
module.exports = app;