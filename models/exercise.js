    
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Int32 from 'mongoose-int32';
import shortid from 'shortid';
import User from './user.js';


const exerciseSchema = new Schema({
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

export default mongoose.model('Exercise', exerciseSchema);