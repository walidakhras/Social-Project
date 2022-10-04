const mongoose = require('mongoose');
const reply = require('./reply')
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const postschema = new Schema({
    title: String,
    images: [ImageSchema],
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    replies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'reply'
        }
    ],
    created: Date
});



postschema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await reply.deleteMany({
            _id: {
                $in: doc.replies
            }
        })
    }
})

module.exports = mongoose.model('Post', postschema);