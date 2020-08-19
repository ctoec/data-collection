import express from 'express';

import { authenticate } from '../middleware/authenticate';
import { router as userRouter } from './user';
import { router as enrollmentReportRouter } from './enrollmentReport';
import { router as dataDefinitionRouter } from './dataDefinition';
import { templateRouter } from './template';

export const router = express.Router();

/* PUBLIC ROUTES */
router.use('/data-definitions', dataDefinitionRouter);
router.use('/template', templateRouter);

/* AUTHENTICATED ROUTES */
router.use('/users', authenticate, userRouter);
router.use('/enrollment-reports', authenticate, enrollmentReportRouter);
