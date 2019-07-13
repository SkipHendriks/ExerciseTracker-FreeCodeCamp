import {Exercise} from '../../../models/exercise.js';
import {User} from '../../../models/user.js';
import {checkDateFormat} from '../../../utils/date.js';

// [POST] endpoint for adding an exercise
const addExercise = async (req, res, next) => {
  try {
    const {userId, description, duration, date:date_string} = req.body;
    inputVerifications(userId, description, duration, date_string);
    const date = date_string ? new Date(date_string) : new Date(Date.now());
    // specifications ask for a username in reponse
    // in my opinion it is better to return no other information than exercise schema
    //   and providing a "/user" endpoint for finding username / _id matches
    //   this saves a database call on all saves done here
    let user = User.findById(userId);
    let new_exercise = Exercise.create({userId, description, duration, date});
    // error handling could get wonky here since both user an new_exercise promises
    //   will return an error on non-existant userId and either one could come up first
    //   removing username from the result fixes this as well
    [user, new_exercise] = await Promise.all([user, new_exercise]);
    // specifications also require _id to be the userId, but I would rather use userId as
    //   the name since it is a foreign id
    //   to keep my schema named right (using the name userId) I had to do some swapping around here
    const response = {...new_exercise.toObject(), _id: new_exercise.userId, username: user.username};
    delete response.userId;
    res.json(response);
  } catch (err) {
    next(err);
  }
};

/*
// prefered version of function above
const addExercise = async (req, res, next) => {
  try {
    const {userId, description, duration, date:date_string} = req.body;
    inputVerifications(userId, duration, date_string);
    const date = date_string ? new Date(date_string) : new Date();
    let new_exercise = await Exercise.create({userId, description, duration, date});
    res.json(new_exercise);
  } catch (err) {
    next(err);
  }
};
*/

const inputVerifications = (userId, description, duration, date) => {
  if (!userId) {
    const err = new Error("userId undefined");
    err.status = 400;
    throw err;
  } else if (!description) {
    const err = new Error("description undefined");
    err.status = 400;
    throw err;
  } else if (!duration) {
    const err = new Error("duration undefined");
    err.status = 400;
    throw err;
  } else if (Number.isNaN(parseInt(duration))) {
    const err = new Error("duration is NaN (Not a Number)");
    err.status = 400;
    throw err;
  } else if (date && !checkDateFormat(date)) {
    const err = new Error("date format incorrect");
    err.status = 400;
    throw err;
  }
};

export {addExercise};