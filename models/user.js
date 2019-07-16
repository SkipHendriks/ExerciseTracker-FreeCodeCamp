import mongoose from 'mongoose';
import shortid from 'shortid';
import uniqueValidator from 'mongoose-unique-validator';
import mongooseHidden from 'mongoose-hidden';

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  _id: {
    type: String,
    default: shortid.generate,
    required: true,
  },
});

// the folowing doesn't work with an arrow function
// a normal anonymous function is recommended in the mongoose docs
// eslint-disable-next-line func-names
userSchema.statics.findById = function (_id) {
  return this.findOne({ _id });
};

userSchema.plugin(uniqueValidator);
const hiddenPlugin = mongooseHidden({ defaultHidden: { __v: true } });
userSchema.plugin(hiddenPlugin);

export default mongoose.model('User', userSchema);
