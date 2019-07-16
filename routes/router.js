// needed because ESLint bugs out on the "import.meta.url" statement in ./index.js
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import express from 'express';

import exerciseRouter from './api/exercise/router.js';

import index from './index.js';

const router = express.Router();

router.use(express.static('public'));

router.use('/api/exercise', exerciseRouter);
router.get('/', index);

export default router;
