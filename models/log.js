let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var LogSchema = Schema({
    report: {
        type: Schema.ObjectId,
        ref: 'Report'
    },
    values: {}
});

module.exports = mongoose.model('Log', LogSchema);