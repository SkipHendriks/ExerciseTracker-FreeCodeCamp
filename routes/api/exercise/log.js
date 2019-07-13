import {Exercise} from '../../../models/exercise.js';
import {User} from '../../../models/user.js';

import {checkDateFormat, equalDate} from '../../../utils/date.js';
import {isEmptyObject} from '../../../utils/object.js';

// [GET] endpoint for list of exercises
const listExercises = async (req, res, next) => {
  try {
    const query = !isEmptyObject(req.query) ? req.query : req.body;
    const {userId, from:fromDate, to:toDate} = query;
    const maxRecords = query.limit && parseInt(query.limit);
    const fromDateObject = fromDate ? new Date(fromDate): undefined;
    const toDateObject = toDate ? new Date(toDate): undefined;
    inputVerifications(userId, fromDate, fromDateObject, toDate, toDateObject, maxRecords);
    let exercises = Exercise.getExerciseLog(userId, fromDateObject, toDateObject, maxRecords);
    let user = User.findById(userId);
    [user, exercises] = await Promise.all([user, exercises]);
    res.json({
      ...user.toObject(),
      log: exercises,
      count: exercises.length
    });
  } catch (err) {
    next(err);
  }
};

const inputVerifications = (userId, fromDate, fromDateObject, toDate, toDateObject, maxRecords) => {
  if (!userId) {
    const err = new Error("userId undefined");
    err.status = 400;
    throw err;
  } else if (fromDate && !checkDateFormat(fromDate)) {
    const err = new Error("'from' date format incorrect");
    err.status = 400;
    throw err;
  } else if (toDate && !checkDateFormat(toDate)) {
    const err = new Error("'to' date format incorrect");
    err.status = 400;
    throw err;
  } else if (toDate && fromDate && fromDateObject > toDateObject) {
    const err = new Error("'to' date comes before 'from' date");
    err.status = 400;
    throw err;
  } else if (toDate && fromDate && equalDate(fromDateObject, toDateObject)) {
    const err = new Error("'to' is equal to 'from' date");
    err.status = 400;
    throw err;
  } else if (Number.isNaN(maxRecords)) {
    const err = new Error("limit is NaN (Not a Number)");
    err.status = 400;
    throw err;
  }
};

export {listExercises};