const express = require('express');
const router = express.Router();

const exerciseRouter = require('./exercise/router');

router.use('/exercise', exerciseRouter);

module.exports = router;