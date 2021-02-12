import express from 'express';
import { getManager } from 'typeorm';
import multer from 'multer';
import {
  BadRequestError,
  ApiError,
  InternalServerError,
} from '../middleware/error/errors';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { validate } from 'class-validator';
import * as controller from '../controllers/enrollmentReports/index';
import fs from 'fs';
import { BatchUpload } from '../../client/src/shared/payloads';

export const enrollmentReportsRouter = express.Router();

// Save uploaded files with timestamps so that if one fails and
// it persists to disk, it's easier to debug
const storage = multer.diskStorage({
  destination: '/tmp/uploads',
  filename: (req, file, callback) =>
    callback(null, file.fieldname + '_' + new Date()),
});
const upload = multer({ storage: storage }).single('file');

/**
 * /enrollment-reports/check POST
 *
 * Ingests an uploaded file, leveraging multer middleware to save it
 * to /tmp/uploads. Then:
 *  - parses the saved file into an array of EnrollmentReportRows
 *  - maps EnrollmentReportRows to child records, which are NOT
 *    persisted to the DB
 *  - computes how many validation errors occur for each column in
 *    the template
 *  - sends back an Error Dictionary mapping columns to how many errors
 *    of that kind occur in the file
 */
enrollmentReportsRouter.post(
  '/check',
  upload,
  passAsyncError(async (req, res) => {
    return getManager().transaction(async (tManager) => {
      try {
        const reportRows = controller.parseUploadedTemplate(req.file);
        const reportChildren = await controller.mapRows(
          tManager,
          reportRows,
          req.user,
          { save: false }
        );

        const childrenWithErrors = await Promise.all(
          reportChildren.map(async (child) => ({
            ...child,
            validationErrors: await validate(child),
          }))
        );

        const errorDict = await controller.checkErrorsInChildren(
          childrenWithErrors
        );

        // Only remove the file from disk if we could successfully parse it
        if (req.file && req.file.path) fs.unlinkSync(req.file.path);

        res.send(errorDict);
      } catch (err) {
        if (err instanceof ApiError) throw err;
        console.error(
          'Unable to determine validation errors in spreadsheet: ',
          err
        );
        throw new BadRequestError(
          'Your file isn’t in the correct format. Use the spreadsheet template without changing the headers.'
        );
      }
    });
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
enrollmentReportsRouter.post(
  '/',
  upload,
  passAsyncError(async (req, res) => {
    return getManager().transaction(async (tManager) => {
      // Ingest upload by parsing, mapping, and saving uploaded data
      try {
        const reportRows = controller.parseUploadedTemplate(req.file);
        const reportChildren = await controller.mapRows(
          tManager,
          reportRows,
          req.user,
          { save: true }
        );

        // TODO: Decide if there's any benefit in actually creating the EnrollmentReport entity,
        // which maps childIds to the upload they came from.
        // Not useful now, but may be useful when users are uploading incremental update reports
        // and we have a need to display to the user which records were updated/added by their
        // upload. Skip creating the report for now to save time (esp for large uploads)

        let numActive = 0,
          numWithdrawn = 0;
        reportChildren.forEach((child) => {
          if (child.enrollments?.every((e) => e.exit)) numWithdrawn += 1;
          else numActive += 1;
        });

        res.status(201).json({
          active: numActive,
          withdrawn: numWithdrawn,
        } as BatchUpload);

        // Only remove the file from disk if we successfully parsed it
        if (req.file && req.file.path) fs.unlinkSync(req.file.path);
      } catch (err) {
        if (err instanceof ApiError) throw err;
        console.error('Error parsing uploaded enrollment report: ', err);
        throw new BadRequestError(
          'Your file isn’t in the correct format. Use the spreadsheet template without changing the headers.'
        );
      }
    });
  })
);
