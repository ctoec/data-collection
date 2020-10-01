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
  InternalServerError,
} from '../middleware/error/errors';
import { passAsyncError } from '../middleware/error/passAsyncError';
import * as controller from '../controllers/enrollmentReports/index';
import { parseQueryString } from '../utils/parseQueryString';

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
    const report = await getManager().findOne(EnrollmentReport, id, {
      relations: [
        'children',
        'children.enrollments',
        'children.enrollments.fundings',
        'children.enrollments.site',
        'children.enrollments.site.organization',
      ],
    });

    if (!report) throw new NotFoundError();

    res.send(report);
  })
);

/**
 * /enrollment-reports POST
 *
 * Ingests an uploaded file, leveraging multer middleware to
 * save it to /tmp/uploads. Then:
 * 	- cleans up existing data for the user as necessary
 * 		(either deleting all child data, or child data associated with the
 * 		sites specified by overwriteSites query string params)
 *  - parses the saved file into an array of EnrollmentReportRows
 *  - maps EnrollmentReportRows to child records, which are persisted to the DB
 * 	- record which child records were updated by this enrollment report
 * 		and saves that to the DB as an EnrollmentReport
 * 	- returns new EnrollmentReport on success
 */
const upload = multer({ dest: '/tmp/uploads' }).single('file');
enrollmentReportsRouter.post(
  '/',
  upload,
  passAsyncError(async (req, res) => {
    // Prepare for ingestion by removing any existing data
    try {
      const siteIdsToReplace = parseQueryString(req, 'overwriteSites', {
        post: parseInt,
        forceArray: true,
      }) as number[];
      controller.removeExistingEnrollmentDataForUser(
        req.user,
        siteIdsToReplace
      );
    } catch (err) {
      console.error('Unable to delete existing data for user:', err);
      throw new InternalServerError('Unable to remove existing roster data');
    }

    // Ingest upload by parsing, mapping, and saving uploaded data
    try {
      const reportRows = controller.parseUploadedTemplate(req.file);
      const reportChildren = await controller.mapAndSaveRows(
        reportRows,
        req.user
      );

      const report = await getManager().save(
        getManager().create(EnrollmentReport, { children: reportChildren })
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
 * /enrollment-reports/download/:reportId GET
 *
 * Returns the given EnrollmentReport as a CSV
 */
enrollmentReportsRouter.get(
  '/download/:reportId',
  passAsyncError(async (req, res) => {
    const id = parseInt(req.params.reportId) || 0;
    const report = await getManager().findOne(EnrollmentReport, id);
    if (!report) throw new NotFoundError();

    const children = report.children;
    const stream = format();

    const randomString = uuid();
    const filename = `/tmp/downloads/${randomString}.csv`;

    const fileStream = fs.createWriteStream(filename);
    fileStream.on('finish', () => res.download(filename));
    stream.pipe(fileStream);

    // TODO
    // stream.write(Object.keys(children[0])); // TODO: Use generated headers
    // children.forEach((enrollment) =>
    //   stream.write(Object.values(enrollment))
    // );
    stream.end();
  })
);
