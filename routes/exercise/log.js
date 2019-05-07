const Exercise = require('../../models/exercise');
const {checkDateFormat} = require('../../utils/date');

// [GET] endpoint for list of exercises
const listExercises = async (req, res, next) => {
  try {
    const {userId, from:fromDate, to:toDate, max:maxRecords} = req.query;
    inputFormatVerifications(userId, fromDate, toDate, maxRecords);
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
    console.log(query);
    const exercises = await Exercise.find(query).sort({date: 'asc'}).limit(parseInt(maxRecords));
    res.json(exercises);
  } catch (err) {
    next(err);
  }
};

const inputFormatVerifications = (userId, fromDate, toDate, maxRecords) => {
  // simple synchronous verifications
  if (userId == '') {
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
    const err = new Error("max is NaN");
    err.status = 400;
    throw err;
  }
};

module.exports = listExercises;