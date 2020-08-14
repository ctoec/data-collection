import express from 'express';
import { getManager } from 'typeorm';
import { EnrollmentReport } from '../entity';
import { format } from '@fast-csv/format';
import { NotFoundError } from '../middleware/error/errors';
import { passAsyncError } from '../middleware/error/passAsyncError';
import fs from 'fs';
import { v4 as uuid } from 'uuid';

export const router = express.Router();

/**
 * /enrollment-reports/:reportId GET
 *
 * Returns the given EnrollmentReport as a CSV
 */
router.get(
  '/:reportId',
  passAsyncError(async (req, res, next) => {
    const id = parseInt(req.params['reportId']) || 0;
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
