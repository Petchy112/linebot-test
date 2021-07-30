const mongoose = require('mongoose')

var schema = mongoose.Schema({
    projectName: { type: String, require: true },
    choice: { type: Array.of({ type: String }), require: true },
    updateAt: { type: Date, default: Date.now() },
    createBy: { type: String, require: true },
    size: { type: String, require: true },
    qty: { type: Number, require: true }
});

var Estimated = mongoose.model('estimated', schema)
module.exports = Estimated