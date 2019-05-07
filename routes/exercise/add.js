const Exercise = require('../../models/exercise');
const {checkDateFormat} = require('../../utils/date');

// [POST] endpoint for adding an exercise
const addExercise = async (req, res, next) => {
  try {
    inputFormatVerifications(req.body);
    const new_exercise = new Exercise ({userId: req.body.userId, description: req.body.description, duration: req.body.duration, date: new Date(req.body.date)});
    await new_exercise.save();
    res.json(new_exercise);
  } catch (err) {
    next(err);
  }
};

const inputFormatVerifications = ({userId, duration, date}) => {
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



module.exports = addExercise;