const mongoose = require('mongoose')


var schema = mongoose.Schema({
    choiceId: { type: String, require: false, default: null},
    name: { type: String, require: false, default: ''},
    description: { type: String, require: false},
    imagePath: { type: String , require: false},
    userId: [String] ,require: false,
    time: [Number],require: false,
    totalTime: {type: Number, require: false, default: 0}
})

var Time = mongoose.model('time', schema)
module.exports = Time