import {Exercise} from '../../../models/exercise.js';
import {User} from '../../../models/user.js';
import {checkDateFormat} from '../../../utils/date.js';

// [POST] endpoint for adding an exercise
const addExercise = async (req, res, next) => {
  try {
    const {userId, description, duration, date:date_string} = req.body;
    inputVerifications(userId, duration, date_string);
    const date = date_string ? new Date(date_string) : new Date();
    // specifications ask for a username in reponse
    // in my opinion it is better to return no other information than exercise schema
    //   and providing a "/user" endpoint for finding username / _id matches
    //   this saves a database call on all saves done here
    let user = User.findOne({_id: userId });
    let new_exercise = new Exercise ({userId, description, duration, date}).save();
    // error handling could get wonky here since both user an new_exercise promises
    //   will return an error on non-existant userId and either one could come up first
    //   removing username from the result fixes this as well
    [user, new_exercise] = await Promise.all([user, new_exercise]);
    // specifications also require _id to be the userId, but I would rather use userId as
    //   the name since it is a foreign id
    //   since I wanted to keep my schema named right (using the name userId) I had to
    //   do some swapping around here
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
    let new_exercise = await new Exercise ({userId, description, duration, date}).save();
    res.json(new_exercise);
  } catch (err) {
    next(err);
  }
};
*/

const inputVerifications = (userId, duration, date) => {
  // simple synchronous verifications
  if (userId == '') {
    const err = new Error("userId undefined");
    err.status = 400;
    throw err;
  }
  if (duration == '') {
    const err = new Error("duration undefined");
    err.status = 400;
    throw err;
  } else if (Number.isNaN(parseInt(duration))) {
    const err = new Error("duration is NaN");
    err.status = 400;
    throw err;
  }
  if (date && !checkDateFormat(date)) {
    const err = new Error("date format incorrect");
    err.status = 400;
    throw err;
  }
};

export {addExercise};