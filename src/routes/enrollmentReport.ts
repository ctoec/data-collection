import express from 'express';
import { getManager } from 'typeorm';
import { EnrollmentReport } from '../entity';
import multer from 'multer';
import { parseUploadedTemplate } from '../utils/parseUploadedTemplate';
import { NotFoundError } from '../middleware/error/errors';
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
    const flattenedEnrollments = parseUploadedTemplate(req.file);
    const report = getManager().save(
      getManager().create(EnrollmentReport, {
        enrollments: flattenedEnrollments,
      })
    );
    res.send(report);
  })
);
