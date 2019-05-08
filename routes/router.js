import express from 'express';

import exerciseRouter from './api/exercise/router.js';
import index from './index.js';

const router = express.Router();

router.use(express.static('public'));

router.use('/api/exercise', exerciseRouter);
router.get('/', index);


export default router;