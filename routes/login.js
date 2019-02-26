var bcrypt = require('bcryptjs');
var express = require('express');
var api = express.Router();
var con = require('../connection.js');
var Customer = require('../models/customer');
var jwt = require('../services/jwt');


api.post('/log', function (req, res) {
    try {
        Customer.find({ user: req.body.correo }, function (err, customer) {
            if (err)
                throw err
            else {
                if (customer.length > 0) {
                    let usuario = customer[0];
                    bcrypt.compare(req.body.pass, usuario.hpassword, function (err, check) {
                        if (check) {
                            res.status(200).send({ token: jwt.createToken(usuario) });
                        } else if (!check || err) {
                            res.status(401).send({ message: 'Correo y/o Contraseña Incorrrectos' });
                        }
                    });
                } else {
                    res.status(401).send({ message: 'El usuario no existe.' });
                }
            }
        });
    } catch (e) {
        res.status(500).send({ message: 'Error del Servidor' });
    }

});

module.exports = api;