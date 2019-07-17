import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import router from './routes/router.js';
import errorHandler from './middlewares/error-handler.js';
import notFoundHandler from './middlewares/not-found.js';
import dateReplacer from './utils/json.js';

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

app.set('json replacer', dateReplacer);

const listener = app.listen(process.env.NODE_ENV === 'test' ? 3001 : 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

export default app;
