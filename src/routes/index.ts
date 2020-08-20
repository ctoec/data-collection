import express from 'express';

import { authenticate } from '../middleware/authenticate';
import { router as userRouter } from './user';
import { router as enrollmentReportRouter } from './enrollmentReport';
import { dataDefinitionRouter } from './dataDefinition';

export const router = express.Router();

/* PUBLIC ROUTES */
router.use('/data-definitions', dataDefinitionRouter);

/* AUTHENTICATED ROUTES */
router.use('/users', authenticate, userRouter);
router.use('/enrollment-reports', authenticate, enrollmentReportRouter);
