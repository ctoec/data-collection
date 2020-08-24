import express from 'express';

import { authenticate } from '../middleware/authenticate';
import { router as userRouter } from './user';
import { router as enrollmentReportRouter } from './enrollmentReport';
import { columnMetadataRouter } from './columnMetadata';
import { childrenRouter } from './children';

export const router = express.Router();

/* PUBLIC ROUTES */
router.use('/column-metadata', columnMetadataRouter);

/* AUTHENTICATED ROUTES */
router.use('/users', authenticate, userRouter);
router.use('/enrollment-reports', authenticate, enrollmentReportRouter);
router.use('/children', authenticate, childrenRouter);
