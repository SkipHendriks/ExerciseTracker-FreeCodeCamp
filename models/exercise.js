    
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Int32 = require('mongoose-int32');
const shortid = require('shortid');
const User = require('./user');


var exerciseSchema = new Schema({
  userId: {
    type: String,
    required: true,
    validate: {
      validator: async (userId) => {
        const user = await User.findOne({_id: userId});
        return user !== null;
      },
      message: "userId doesn't exist"
    }
  },
  description: String,
  duration: {
    type: Int32,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  _id: {
    type: String,
    default: shortid.generate,
    required: true,
  }
});


module.exports = mongoose.model('Exercise', exerciseSchema);