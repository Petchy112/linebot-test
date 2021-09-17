const mongoose = require('mongoose')


var schema = mongoose.Schema({
    userId: { type: String, require: false },
    email: { type: String, require: true },
    passwordHash: { type: String, require: true },
    firstname: { type: String, require: true },
    lastname: { type: String, require: true },
    lineUserId: { type: String, require:false },
    profilePic : { type: String, require:false },
    role: {
        type: Array, require: true
    },

},
{
    timestamps: true
})
var User = mongoose.model('user', schema)
module.exports = User