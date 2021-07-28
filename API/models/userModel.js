const mongoose = require('mongoose')


var schema = mongoose.Schema({
    userId: { type: String, require: false },
    email: { type: String, require: true },
    firstname: { type: String, require: true },
    lastname: { type: String, require: true },
    password: { type: String, require: true }

})
var User = mongoose.model('user', schema)
module.exports = User