import express from 'express';
import { getManager } from 'typeorm';
import { format } from '@fast-csv/format';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import multer from 'multer';

import { EnrollmentReport, FlattenedEnrollment } from '../entity';
import { parseUploadedTemplate } from '../utils/parseUploadedTemplate';
import {
  NotFoundError,
  BadRequestError,
  ApiError,
} from '../middleware/error/errors';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { mapFlattenedEnrollment } from '../utils/mapFlattenedEnrollment';

export const router = express.Router();

/**
 * /enrollment-reports/:reportId GET
 *
 * Returns the parsed data from the given EnrollmentReport,
 * as nested data object with Child as root.
 */
router.get(
  '/:reportId',
  passAsyncError(async (req, res) => {
    const id = parseInt(req.params['reportId']) || 0;
    const report = await getManager().findOne(EnrollmentReport, id);

    if (!report) throw new NotFoundError();

    const enrollments = await Promise.all(
      report.enrollments.map(mapFlattenedEnrollment)
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
router.post(
  '/',
  upload,
  passAsyncError(async (req, res) => {
    try {
      const { EXPECTED_HEADERS, headers, enrollments } = parseUploadedTemplate(
        req.file
      );

      // Array comparison was returning false even when the strings matched
      if (!EXPECTED_HEADERS.every((header, idx) => header === headers[idx])) {
        throw new BadRequestError(
          'Columns from uploaded template do not match expected values'
        );
      }

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
router.get(
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
