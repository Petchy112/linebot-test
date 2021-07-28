const mongoose = require('mongoose')

var choiceSchema = mongoose.Schema({
    name: { type: String, require: true },
    description: { type: String, require: true },
    time: { type: Number, require: false, default: '', }
},
    { _id: false });

var schema = mongoose.Schema({
    group: { type: String, require: true },
    choice: { type: Array.of(choiceSchema), require: true },
    updateAt: { type: Date, default: Date.now() }
});

var Function = mongoose.model('functions', schema)
module.exports = Function