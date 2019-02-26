var express = require('express')
var api = express.Router();
var middleware = require('../middlewares/authentication.js');
var path = require('path');
api.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/production/index.html'));
});
api.get('/report', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/production/report.html'))
});

api.get('/parts', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/production/parts.html'))
});

api.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/production/login.html'));
});
api.get('/reportslog/:report', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/production/ReportsLogs.html'))
});

module.exports = api;