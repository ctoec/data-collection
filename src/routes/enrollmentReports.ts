import express from 'express';
import { getManager } from 'typeorm';
import { format } from '@fast-csv/format';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import multer from 'multer';

import { EnrollmentReport } from '../entity';
import {
  NotFoundError,
  BadRequestError,
  ApiError,
} from '../middleware/error/errors';
import { passAsyncError } from '../middleware/error/passAsyncError';
import * as controller from '../controllers/enrollmentReports/index';

export const enrollmentReportsRouter = express.Router();

/**
 * /enrollment-reports/:reportId GET
 *
 * Returns the parsed data from the given EnrollmentReport,
 * as nested data object with Child as root.
 */
enrollmentReportsRouter.get(
  '/:reportId',
  passAsyncError(async (req, res) => {
    const id = parseInt(req.params['reportId']) || 0;
    const report = await getManager().findOne(EnrollmentReport, id);

    if (!report) throw new NotFoundError();

    const enrollments = await Promise.all(
      report.enrollments.map(controller.mapFlattenedEnrollment)
    );
    res.send(enrollments.filter((e) => !!e));
  })
);

/**
 * /enrollment-reports POST
 *
 * Ingests an uploaded file, leveraging multer middleware to
 * save it to /tmp/uploads. Then, parses the saved file into
 * an array of FlattenedEnrollments, saves them to the DB as
 * an EnrollmentReport, and returns the report.
 */
const upload = multer({ dest: '/tmp/uploads' }).single('file');
enrollmentReportsRouter.post(
  '/',
  upload,
  passAsyncError(async (req, res) => {
    try {
      const enrollments = controller.parseUploadedTemplate(req.file);
      const report = await getManager().save(
        getManager().create(EnrollmentReport, { enrollments })
      );
      res.status(201).json({ id: report.id });
    } catch (err) {
      if (err instanceof ApiError) throw err;

      console.error('Error parsing uploaded enrollment report: ', err);
      throw new BadRequestError(
        'Your file isn’t in the correct format. Use the spreadsheet template without changing the headers.'
      );
    }
  })
);

/**
 * /enrollment-reports/:reportId GET
 *
 * Returns the given EnrollmentReport as a CSV
 */
enrollmentReportsRouter.get(
  '/download/:reportId',
  passAsyncError(async (req, res) => {
    const id = parseInt(req.params.reportId) || 0;
    const report = await getManager().findOne(EnrollmentReport, id);
    if (!report) throw new NotFoundError();

    const enrollments = report.enrollments;
    const stream = format();

    const randomString = uuid();
    const filename = `/tmp/downloads/${randomString}.csv`;

    const fileStream = fs.createWriteStream(filename);
    fileStream.on('finish', () => res.download(filename));
    stream.pipe(fileStream);

    stream.write(Object.keys(enrollments[0])); // TODO: Use generated headers
    enrollments.forEach((enrollment) =>
      stream.write(Object.values(enrollment))
    );
    stream.end();
  })
);
