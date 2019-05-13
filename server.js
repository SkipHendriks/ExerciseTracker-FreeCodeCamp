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

mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/fcc-exercise-tracker', { useNewUrlParser: true,  useCreateIndex: true});

// enable cors to allow testing by FreeCodeCamp
app.use(cors());

// main router
app.use('/', router);

// middleware
app.use(notFoundHandler);
app.use(errorHandler);


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});