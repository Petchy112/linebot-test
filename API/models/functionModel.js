const mongoose = require('mongoose');
const TimeResult = require('./timeResultModel');

var choiceSchema = mongoose.Schema({
    name: { type: String, require: true },
    description: { type: String, require: true },
})

var schema = mongoose.Schema({
    status: {type: String, enum: ['OPEN','CLOSE'], default:'OPEN', require:true},
    round: { type:Number, require:true, default: 0},
    platform: { type: String, enum: ['WEBSITE', 'MOBILE'], require: false },
    group: { type: String, require: true },
    choice: { type: Array.of(choiceSchema), require: true },
    updateAt: { type: Date, default: Date.now() }
});

var Function = mongoose.model('functions', schema)
module.exports = Function