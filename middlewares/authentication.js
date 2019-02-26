var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';


exports.ensureAuth = function (req, res, next) {
    if (req.headers.authorization == "null") {
        res.redirect('/login');
        return;
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        var payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix) {
            res.redirect('/login');
            //return res.status(401).send({ message: 'Token ha expirado' });

        } else {
            req.payload = payload;
            next();
        }
    } catch (ex) {
        res.redirect('/login');
    }

}