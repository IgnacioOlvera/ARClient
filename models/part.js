var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PartSchema = Schema({
    name: String,
    number: String,
    customer: { type: Schema.ObjectId, ref: 'Customer' }

});

module.exports = mongoose.model('Part', PartSchema);