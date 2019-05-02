    
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');

var UserSchema = new Schema({
  username: String,
  _id: {
    'type': String,
    'default': shortid.generate
  },
});

module.exports = mongoose.model('User', UserSchema);