const express = require('express');
const router = express.Router();

const newUser = require('./new-user.js');
const addExercise = require('./add.js');
const listExercises = require('./log.js');


router.post('/new-user', newUser);
router.post('/add', addExercise);
router.get('/log', listExercises);

module.exports = router;