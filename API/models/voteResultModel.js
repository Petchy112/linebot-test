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
    choices: { type: Array.of(choiceSchema), require: false },
    votingDate: { type: String, require: false },
    voteRound: { type:Number, require: false}
});

var VoteResult = mongoose.model('results', schema)
module.exports = VoteResult