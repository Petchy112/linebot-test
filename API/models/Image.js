const mongoose = require('mongoose');


var schema = mongoose.Schema({
    refId:  { type: String, require: true },
    name:  { type: String,require: true },
    imagePath: { type: String, require: true },
    mimetype: { type: String, require: true },
},
{
    timestamps: true,
}
);

var Image = mongoose.model('images', schema)
module.exports = Image
