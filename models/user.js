import mongoose from 'mongoose';
import shortid from 'shortid';
import uniqueValidator from 'mongoose-unique-validator';

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

export default mongoose.model('User', userSchema);