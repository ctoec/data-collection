import express from 'express';

import { authenticate } from '../middleware/authenticate';
import { router as userRouter } from './user';
import { enrollmentReportsRouter } from './enrollmentReports';
import { childrenRouter } from './children';
import { columnMetadataRouter } from './columnMetadata';
import { sitesRouter } from './sites';
import { enrollmentsRouter } from './enrollments';
import { familyRouter } from './families';
import { fundingSpacesRouter } from './fundingSpaces';
import { reportingPeriodsRouter } from './reportingPeriods';
import { fundingsRouter } from './fundings';
import { exportRouter } from './export';

export const router = express.Router();

/* PUBLIC ROUTES */
router.use('/column-metadata', columnMetadataRouter);

/* AUTHENTICATED ROUTES */
router.use('/users', authenticate, userRouter);
router.use('/enrollment-reports', authenticate, enrollmentReportsRouter);
router.use('/children', authenticate, childrenRouter);
router.use('/families', authenticate, familyRouter);
router.use('/sites', authenticate, sitesRouter);
router.use('/enrollments', authenticate, enrollmentsRouter);
router.use('/enrollments/:enrollmentId/fundings', authenticate, fundingsRouter);
router.use('/funding-spaces', authenticate, fundingSpacesRouter);
router.use('/reporting-periods', authenticate, reportingPeriodsRouter);
router.use('/export', authenticate, exportRouter);
