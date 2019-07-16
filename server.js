import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import router from './routes/router.js';
import errorHandler from './middlewares/error-handler.js';
import notFoundHandler from './middlewares/not-found.js';

dotenv.config();

const app = express();


const MONGO_URI = process.env.NODE_ENV === 'test' ? process.env.MLAB_TEST_URI : process.env.MLAB_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useCreateIndex: true });

// enable cors to allow testing by FreeCodeCamp
app.use(cors());

// main router
app.use('/', router);

// middleware
app.use(notFoundHandler);
app.use(errorHandler);

// app.set('json replacer', (key, value) => {
//   let newValue;
//   console.log(`key ${key}`);
//   console.log(`value ${value}`);
//   if (value instanceof Date) {
//     console.log('nextr one')
//     newValue = value.toDateString();
//   } else {
//     newValue = value;
//   }
//   return newValue;
// });

// eslint-disable-next-line func-names
app.set('json replacer', function (key, value) {
  let newValue = value;
  if (this[key] instanceof Date) {
    newValue = this[key].toDateString();
  }
  return newValue;
});

const listener = app.listen(process.env.NODE_ENV === 'test' ? 3001 : 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

export default app;
