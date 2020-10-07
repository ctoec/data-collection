import express from 'express';

import { authenticate } from '../middleware/authenticate';
import { usersRouter } from './users';
import { enrollmentReportsRouter } from './enrollmentReports';
import { childrenRouter } from './children';
import { sitesRouter } from './sites';
import { enrollmentsRouter } from './enrollments';
import { familyRouter } from './families';
import { fundingSpacesRouter } from './fundingSpaces';
import { reportingPeriodsRouter } from './reportingPeriods';
import { fundingsRouter } from './fundings';
import { templateRouter } from './template';
import { exportRouter } from './export';
import { oecReportRouter } from './oecReport';

export const router = express.Router();

/* PUBLIC ROUTES */
router.use('/template', templateRouter);

/* AUTHENTICATED ROUTES */
router.use('/users', authenticate, usersRouter);

router.use('/enrollment-reports', authenticate, enrollmentReportsRouter);

router.use('/children', authenticate, childrenRouter);

router.use('/families', authenticate, familyRouter);

router.use('/sites', authenticate, sitesRouter);

router.use('/enrollments', authenticate, enrollmentsRouter);
router.use('/enrollments/:enrollmentId/fundings', authenticate, fundingsRouter);

router.use('/funding-spaces', authenticate, fundingSpacesRouter);

router.use('/reporting-periods', authenticate, reportingPeriodsRouter);
router.use('/export', authenticate, exportRouter);

router.use('/oec-report', authenticate, oecReportRouter);
