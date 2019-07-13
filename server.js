// TODO: https://medium.freecodecamp.org/how-to-write-a-production-ready-node-and-express-app-f214f0b17d8c
// TODO: write tests
// TODO: fix '../.../..' bullshit
// TODO: check if original returns id with every line in log

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as Promise from 'bluebird';

import {router} from './routes/router.js';
import {errorHandler} from'./middlewares/error-handler.js';
import {notFoundHandler} from './middlewares/not-found.js';

const app = express();


const MONGO_URI = process.env.NODE_ENV == 'test' ? process.env.MLAB_TEST_URI : process.env.MLAB_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true,  useCreateIndex: true});

// enable cors to allow testing by FreeCodeCamp
app.use(cors());

// main router
app.use('/', router);

// middleware
app.use(notFoundHandler);
app.use(errorHandler);

app.set('json replacer', function (key, value) {
  if (this[key] instanceof Date) {
    value = this[key].toDateString();
  }
  return value;
});

const listener = app.listen(process.env.NODE_ENV == 'test'? 3001 : 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

export {app};