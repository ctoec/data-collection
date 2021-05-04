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
import { templateRouter } from './template';
import { exportRouter } from './export';
import { oecReportRouter } from './oecReport';
import { revisionsRouter } from './revisions';
import { summaryRouter } from './summary';
import { organizationsRouter } from './organizations';

export const router = express.Router();

/* PUBLIC ROUTES */
router.use('/template', templateRouter);

/* AUTHENTICATED ROUTES */
router.use('/users', authenticate, usersRouter);

router.use('/enrollment-reports', authenticate, enrollmentReportsRouter);

router.use('/children', authenticate, childrenRouter);

router.use('/families', authenticate, familyRouter);

router.use('/enrollments', authenticate, enrollmentsRouter);

router.use('/funding-spaces', authenticate, fundingSpacesRouter);

router.use('/sites', authenticate, sitesRouter);

router.use('/reporting-periods', authenticate, reportingPeriodsRouter);

router.use('/oec-report', authenticate, oecReportRouter);

router.use('/revision-request', authenticate, revisionsRouter);

router.use('/export', authenticate, exportRouter);

router.use('/summary', authenticate, summaryRouter);

router.use('/organizations', authenticate, organizationsRouter);
