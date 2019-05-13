import mongoose from 'mongoose';
import shortid from 'shortid';
import uniqueValidator from 'mongoose-unique-validator';
import mongooseHidden from 'mongoose-hidden';

const Schema = mongoose.Schema;

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
const hiddenPlugin = mongooseHidden({defaultHidden: {__v: true}});
userSchema.plugin(hiddenPlugin);

export const User = mongoose.model('User', userSchema);