var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';
exports.createToken = function (user) {
    var payload = {
        id: user._id,
        nombre: user.name,
        correo: user.rfc,
        iat: moment().unix(),
        exp: moment().add(8, 'hours').unix()
    };
    return jwt.encode(payload, secret);
}