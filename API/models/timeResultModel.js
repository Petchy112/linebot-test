const mongoose = require('mongoose')


var schema = mongoose.Schema({
    choiceId: { type: String, require: false, default: ''},
    name: { type: String, require: false, default: ''},
    userId: [String] ,require: false,
    time: [Number],require: false,
    totalTime: {type: Number, require: false, default: ''}
})

var Time = mongoose.model('time', schema)
module.exports = Time