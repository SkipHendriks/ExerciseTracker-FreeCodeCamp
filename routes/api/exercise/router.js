import express from 'express';
const router = express.Router();

import newUser from './new-user.js';
import addExercise from './add.js';
import listExercises from './log.js';


router.post('/new-user', newUser);
router.post('/add', addExercise);
router.get('/log', listExercises);

export default router;