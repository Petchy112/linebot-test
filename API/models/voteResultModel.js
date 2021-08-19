const mongoose = require('mongoose')

var choiceSchema = mongoose.Schema({
    name: { type: String, require: true },
    time: { type: Number, require: false, default: '', }
},
    { _id: false });

var schema = mongoose.Schema({
    platform: { type: String, enum: ['WEBSITE', 'MOBILE'], require: true },
    functionId: {type: String , require: true },
    group: { type: String, require: true },
    choice: { type: Array.of(choiceSchema), require: false },
    votingDate: { type: Date, default: Date.now() }
});

var VoteResult = mongoose.model('results', schema)
module.exports = VoteResult