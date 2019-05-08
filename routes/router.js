import express from 'express';
const router = express.Router();

import exerciseRouter from './api/exercise/router.js';

router.use('api/exercise', exerciseRouter);

export default router;