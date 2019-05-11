import Exercise from '../../../models/exercise.js';
import User from '../../../models/user.js';

import {checkDateFormat} from '../../../utils/date.js';

// [GET] endpoint for list of exercises
const listExercises = async (req, res, next) => {
  try {
    const {userId, from:fromDate, to:toDate, limit:maxRecords} = req.query;
    inputFormatVerifications(userId, fromDate, toDate, maxRecords);
    let exercises = getExercises(userId, fromDate, toDate, maxRecords);
    let exerciseCount = countExercises(userId, fromDate, toDate);
    let user = getUser(userId);
    console.log(user);
    [user, exercises, exerciseCount] = await Promise.all([user, exercises, exerciseCount]);
    res.json({
      _id: user._id, // posibly ...user with mongoose-hidden
      username: user.username, // idem
      log: exercises,
      count: exerciseCount
    });
  } catch (err) {
    next(err);
  }
};

const getExercises = (userId, fromDate, toDate, maxRecords) => {
  const query = buildExercisesQuery(userId, fromDate, toDate);
  return Exercise.find(query).sort({date: 'asc'}).limit(parseInt(maxRecords));
}

const countExercises = (userId, fromDate, toDate) => {
  const query = buildExercisesQuery(userId, fromDate, toDate);
  return Exercise.countDocuments(query);
}

const buildExercisesQuery = (userId, fromDate,toDate) => {
  let query = {userId};
  if (fromDate || toDate) {
    query.date = {};
    if (fromDate) {
      query.date.$gte = new Date(fromDate);
    }
    if (toDate) {
      query.date.$lte =  new Date(toDate);
    }
  }
  return query;
}

const getUser = (userId) => {
  return User.findOne({_id: userId});
}

const inputFormatVerifications = (userId, fromDate, toDate, maxRecords) => {
  // simple synchronous verifications
  if (!userId) {
    const err = new Error("userId undefined");
    err.status = 400;
    throw err;
  }
  if (fromDate && !checkDateFormat(fromDate)) {
    const err = new Error("'from' date format incorrect");
    err.status = 400;
    throw err;
  }
  if (toDate && !checkDateFormat(toDate)) {
    const err = new Error("'to' date format incorrect");
    err.status = 400;
    throw err;
  }
  if (maxRecords && Number.isNaN(parseInt(maxRecords))) {
    const err = new Error("limit is NaN");
    err.status = 400;
    throw err;
  }
};

export default listExercises;