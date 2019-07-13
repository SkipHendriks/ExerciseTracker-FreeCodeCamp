import mongoose from 'mongoose';
import Int32 from 'mongoose-int32';
import shortid from 'shortid';
import mongooseHidden from 'mongoose-hidden';

import {User} from './user.js';

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  userId: {
    type: String,
    required: true,
    validate: {
      validator: async (userId) => {
        const user = await User.findById(userId);
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

exerciseSchema.statics.getExerciseLog = function (userId, fromDate, toDate, maxRecords) {
  const query = buildExercisesQuery(userId, fromDate, toDate);
  return Exercise.find(query).limit(maxRecords).select(['-userId']);
}

const buildExercisesQuery = (userId, fromDate, toDate) => {
  let query = {userId};
  if (fromDate || toDate) {
    query.date = {};
    if (fromDate) {
      query.date.$gte = fromDate;
    }
    if (toDate) {
      query.date.$lte = toDate;
    }
  }
  return query;
}

const hiddenPlugin = mongooseHidden();
exerciseSchema.plugin(hiddenPlugin);

export const Exercise = mongoose.model('Exercise', exerciseSchema);