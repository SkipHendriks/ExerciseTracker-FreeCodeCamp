
// TODO: https://medium.freecodecamp.org/how-to-write-a-production-ready-node-and-express-app-f214f0b17d8c
// TODO: write tests

import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import cors from 'cors';

import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

import router from './routes/router.js';

import errorHandler from'./middlewares/error-handler.js';
import notFoundHandler from './middlewares/not-found.js';

import mongoose from 'mongoose';
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/fcc-exercise-tracker', { useNewUrlParser: true,  useCreateIndex: true});



app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// move to static router in /routers
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.use('/api', router);

app.use(notFoundHandler);
app.use(errorHandler);


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
