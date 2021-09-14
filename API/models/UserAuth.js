const mongoose = require('mongoose')
var schema = mongoose.Schema({
    userId: { type: String, require: true },
    accessToken: { type: String, require: true, },
    accessTokenExpiresAt: { type: Date, require: true }
})

var UserAuth = mongoose.model('userAuth', schema)
module.exports = UserAuth