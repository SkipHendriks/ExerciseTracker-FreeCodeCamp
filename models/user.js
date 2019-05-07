    
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');
const uniqueValidator = require('mongoose-unique-validator');


var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  _id: {
    type: String,
    default: shortid.generate,
    required: true
  },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);