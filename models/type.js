let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var TypeSchema = Schema({
    name: String,
    customer: { type: Schema.ObjectId, ref: 'Customer' },
    attributes: []
});

module.exports = mongoose.model('Type', TypeSchema);