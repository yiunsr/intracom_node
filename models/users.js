/*
* Sample Code From
* https://thinkster.io/tutorials/node-json-api/creating-the-user-model
*/
const mongoose = require('mongoose');
const crypto = require('crypto');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema(
  {

    email: {
        type: String, 
        lowercase: true,
        required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], 
        index: true
    },
    usertype : { type: String, lowercase: true},
    lastlogin : { type: Date }
  },
  {timestamps: true}
);


UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);