import express from 'express';
import bodyParser from 'body-parser';

import newUser from './new-user.js';
import addExercise from './add.js';
import listExercises from './log.js';
import listUsers from './users.js';
import getUser from './user.js';

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/new-user', newUser);
router.get('/users', listUsers);
router.get('/user/:_id?', getUser);
router.post('/add', addExercise);
router.get('/log', listExercises);

export default router;
