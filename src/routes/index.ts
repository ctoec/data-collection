import express from 'express';

import { router as userRouter } from './user';
import { authenticate } from '../middleware/authenticate_NEW';

export const router = express.Router();

router.use('/users', authenticate, userRouter);
