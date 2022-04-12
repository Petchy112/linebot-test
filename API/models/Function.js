const mongoose = require('mongoose');
const status = {
    OPEN: 'OPEN',
    CLOSE: 'CLOSE'
}
var choiceSchema = mongoose.Schema({
    name: { 
        type: String, 
        require: true 
    },
    description: {
         type: String,
          require: true 
        },
    time: { 
        type: Number, 
        require: false 
    },
    imagePath: { 
        type: String, 
        require: false 
    },
})

var schema = mongoose.Schema({
    status: {
        type: String,
        enum: [status] ,
        default: 'OPEN', 
        require: true
    },
    // round: {
    //     type:Number, 
    //     require:true,
    //     default: 1
    // },
    platform: {
        type: String, 
        enum: ['WEBSITE', 'MOBILE'],
        require: false 
    },
    group: { 
        type: String,
        require: true 
    },
    choices: {
        type: Array.of(choiceSchema),
        require: true 
    },
},
{
    timestamps: true,
});

var Function = mongoose.model('functions', schema)
module.exports = Function ,status