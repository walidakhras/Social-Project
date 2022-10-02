const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// const ImageSchemaTwo = new Schema({
//     url: String,
//     filename: String
// });

// ImageSchemaTwo.virtual('thumbnail').get(function () {
//     return this.url.replace('/upload', '/upload/w_200');
// });


const UserSchema = new Schema({ //Just need email, other registration is handled by passport
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        url: String,
        filename: String
    },
    createdOn: Date,
    description: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);