const mongoose = require('mongoose')

// var choiceSchema = mongoose.Schema({
//     time: { type: Number, require: false }
// })

var schema = mongoose.Schema({
    choiceId: { type: String, require: true },
    userId: [String],
    time: [Number],
    totalTime: {type: Number, require: true}
})

var Time = mongoose.model('time', schema)
module.exports = Time