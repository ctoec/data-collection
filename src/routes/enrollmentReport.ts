import express from 'express';
import { getManager } from 'typeorm';
import { EnrollmentReport } from '../entity';
import multer from 'multer';
import { parseUploadedTemplate } from '../utils/parseUploadedTemplate';
import { NotFoundError, BadRequestError } from '../middleware/error/errors';
import { passAsyncError } from '../middleware/error/passAsyncError';

export const router = express.Router();

/**
 * /enrollment-reports/:reportId GET
 *
 * Returns the given EnrollmentReport, or a 404
 */
router.get(
  '/:reportId',
  passAsyncError(async (req, res, next) => {
    const id = parseInt(req.params['reportId']) || 0;
    const report = await getManager().findOne(EnrollmentReport, id);

    if (!report) throw new NotFoundError();
    res.send(report);
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
  passAsyncError(async (req, res, next) => {
    try {
      const { EXPECTED_HEADERS, headers, enrollments } = parseUploadedTemplate(
        req.file
      );

      EXPECTED_HEADERS.forEach((header, idx) => {
        if (header !== headers[idx]) console.log(header, headers[idx]);
      });

      // Array comparison was returning false even when the strings matched
      if (!EXPECTED_HEADERS.every((header, idx) => header === headers[idx])) {
        throw new BadRequestError(
          'Columns from uploaded template do not match expected values'
        );
      }

      const report = await getManager().save(
        getManager().create(EnrollmentReport, { enrollments })
      );
      res.send(report);
    } catch (err) {
      console.error('Error parsing uploaded enrollment report: ', err);
      throw new BadRequestError('Unable to parse uploaded report');
    }
  })
);
