const express = require('express');
const app = express();
const bodyParser = require('body-parser');

 
const cors = require('cors');

const mongoose = require('mongoose');
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/fcc-exercise-tracker', { useNewUrlParser: true});

const User = require('./models/user');
const Exercise = require('./models/exercise');

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// [POST] endpoint for adding a user
app.post('/api/exercise/new-user', async (req, res, next) => {
  try {
    if (req.body.username == '') {
      const err = new Error("Username undefined");
      err.status = 400;
      throw err;
    }
    const new_user = new User ({username: req.body.username});
    await new_user.save();
    res.json({username: new_user.username, _id: new_user._id});
  } catch (err) {
    next(err);
  }
});

// [POST] endpoint for adding an exercise
app.post('/api/exercise/add', async (req, res, next) => {
  try {
    
    // simple verifications
    if (req.body.userId == '') {
      const err = new Error("userId undefined");
      err.status = 400;
      throw err;
    }
    if (req.body.duration == '') {
      const err = new Error("duration undefined");
      err.status = 400;
      throw err;
    } else if (Number.isNaN(parseInt(req.body.duration))) {
      const err = new Error("duration is NaN");
      err.status = 400;
      throw err;
    }
    if (req.body.date == '') {
      const err = new Error("date undefined");
      err.status = 400;
      throw err;
    } else if (!/^\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/.test(req.body.date)) {
      const err = new Error("date format incorrect");
      err.status = 400;
      throw err;
    }
    
    
    const new_exercise = new Exercise ({userId: req.body.userId, description: req.body.description, duration: req.body.duration, date: new Date(req.body.date)});
    await new_exercise.save();
    res.json(new_exercise);
  } catch (err) {
    next(err);
  }
});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'});
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || 'Internal Server Error';
  }
  res.status(errCode).type('txt')
    .send(errMessage);
});




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
