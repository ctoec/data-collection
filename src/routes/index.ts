import express, { json } from 'express';

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
import moment from 'moment';

export const router = express.Router();

/* PUBLIC ROUTES */
router.use('/template', templateRouter);

/* AUTHENTICATED ROUTES */
router.use('/enrollment-reports', enrollmentReportsRouter);

// Register pre-processing middlewares
const dateReviver = (_: any, value: string) => {
  if (typeof value === 'string') {
    const parsedDate = moment.utc(value, undefined, true);
    if (parsedDate.isValid()) return parsedDate;
  }
  return value;
};
router.use(json({ reviver: dateReviver }));

router.use('/users', authenticate, usersRouter);

router.use('/children', authenticate, childrenRouter);

router.use('/families', authenticate, familyRouter);

router.use('/enrollments', authenticate, enrollmentsRouter);

router.use('/funding-spaces', authenticate, fundingSpacesRouter);

router.use('/sites', authenticate, sitesRouter);

router.use('/reporting-periods', authenticate, reportingPeriodsRouter);

router.use('/oec-report', authenticate, oecReportRouter);

router.use('/export', authenticate, exportRouter);
