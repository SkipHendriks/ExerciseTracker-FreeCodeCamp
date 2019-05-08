import Exercise from '../../../models/exercise.js';
import {checkDateFormat} from '../../../utils/date.js';

// [POST] endpoint for adding an exercise
const addExercise = async (req, res, next) => {
  try {
    const {userId, description, duration, date:date_string} = req.body;
    inputFormatVerifications(userId, duration, date);
    const date = new Date(date_string);
    const new_exercise = new Exercise ({userId, description, duration, date});
    await new_exercise.save();
    res.json(new_exercise);
  } catch (err) {
    next(err);
  }
};

const inputFormatVerifications = (userId, duration, date) => {
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
  if (date == '') {
    const err = new Error("date undefined");
    err.status = 400;
    throw err;
  } else if (!checkDateFormat(date)) {
    const err = new Error("date format incorrect");
    err.status = 400;
    throw err;
  }
};


export default addExercise;