var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';


exports.ensureAuth = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).redirect('/login');;
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        var payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix) {
            return res.status(403).redirect('/login');;

        } else {
            req.payload = payload;
            next();
        }
    } catch (ex) {
        return res.status(403).redirect('/login');
    }

}