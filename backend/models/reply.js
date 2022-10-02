const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const replieschema = new Schema({
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("reply", replieschema);

