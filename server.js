const express = require('express');
const app = express();
const bodyParser = require('body-parser');

 
const cors = require('cors');

const mongoose = require('mongoose');
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/fcc-exercise-tracker', { useNewUrlParser: true});

const User = require('./models/user');

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
