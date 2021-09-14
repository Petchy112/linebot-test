const mongoose = require('mongoose')

var schema = mongoose.Schema({
    projectName: { type: String, require: true },
    choice: { type: Array.of({ type: String }), require: true },
    createBy: { type: String, require: true },
    size: { type: String, require: true },
    estimatedTime: { type: Number, require: false},
    platform: { type: String, require:false },
    qty: { type: Number, require: true }
},{
    timestamps: true,
});

var Estimated = mongoose.model('estimated', schema)
module.exports = Estimated