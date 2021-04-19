import express from 'express';
import { getManager } from 'typeorm';
import multer from 'multer';
import { BadRequestError, ApiError } from '../middleware/error/errors';
import { passAsyncError } from '../middleware/error/passAsyncError';
import * as controller from '../controllers/enrollmentReports/index';
import fs from 'fs';
import {
  EnrollmentReportCheckResponse,
  EnrollmentColumnError,
  EnrollmentReportUploadResponse,
} from '../../client/src/shared/payloads';
import { ChangeTag, Child } from '../../client/src/shared/models';
import { batchSave } from '../controllers/enrollmentReports/map/batchSave';
import * as mapController from '../controllers/enrollmentReports/map';

const CHANGE_TAGS_DENOTING_UPDATE = [
  ChangeTag.AgedUp,
  ChangeTag.ChangedEnrollment,
  ChangeTag.ChangedFunding,
  ChangeTag.Edited,
  ChangeTag.IncomeDet,
];

export const enrollmentReportsRouter = express.Router();

// Save uploaded files with timestamps so that if one fails and
// it persists to disk, it's easier to debug
const storage = multer.diskStorage({
  destination: '/tmp/uploads',
  filename: (req, file, callback) => {
    return callback(null, `user_${req.user?.id}_` + new Date().toISOString());
  },
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
    return getManager().transaction(async (transaction) => {
      try {
        const reportRows = controller.parseUploadedTemplate(req.file);
        const thingHolder = await mapController.setUpThingHolder(
          transaction,
          req.user
        );
        const reportChildren = await mapController.mapRows(
          reportRows,
          thingHolder
        );

        const enrollmentColumnErrors: EnrollmentColumnError[] = await controller.checkErrorsInChildren(
          reportChildren
        );

        // Log children with errors, without PII, to make troubleshooting easier
        if (enrollmentColumnErrors?.length) {
          logUploadErrors(req.user.id, reportChildren);
        }

        // Only remove the file from disk if we could successfully parse it
        if (req.file && req.file.path) fs.unlinkSync(req.file.path);

        const response: EnrollmentReportCheckResponse = {
          columnErrors: enrollmentColumnErrors,
          uploadPreview: controller.formatUploadPreview(reportChildren),
          counts: getUploadCounts(reportChildren),
        };

        res.send(response);
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
 * Helper function to log children with validation errors,
 * without PII
 * @param userId
 * @param childrenWithErrors
 */
const logUploadErrors = (userId: number, childrenWithErrors: Child[]) => {
  console.log(
    `User ${userId} uploaded sheet with errors: ${JSON.stringify(
      childrenWithErrors
        .filter((child) => child.validationErrors?.length)
        .map((child) => ({
          ...child,
          lastName: child.lastName?.charAt(0),
          birthCertificateId: child.birthCertificateId
            ?.toString()
            .replace(/./g, '#'),
          birthdate: child.birthdate ? '##/##/####' : undefined,
          family: {
            ...child.family,
            streetAddress: child.family?.streetAddress?.replace(/./g, '#'),
          },
        }))
    )}`
  );
};

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
    return getManager().transaction(async (transaction) => {
      // Ingest upload by parsing, mapping, and saving uploaded data
      try {
        const reportRows = controller.parseUploadedTemplate(req.file);
        const thingHolder = await mapController.setUpThingHolder(
          transaction,
          req.user
        );
        const reportChildren = await mapController.mapRows(
          reportRows,
          thingHolder
        );

        // Save to DB
        await mapController.batchSave(req.user, transaction, reportChildren);

        // Use tags to decide which kinds of uploads/updates were performed
        // on each record
        const response: EnrollmentReportUploadResponse = getUploadCounts(
          reportChildren
        );

        res.status(201).send(response);

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

const getUploadCounts = (children: Child[]) => {
  return children.reduce(
    (response, child) => {
      if (child.tags.includes(ChangeTag.NewRecord)) response.newCount += 1;
      else if (CHANGE_TAGS_DENOTING_UPDATE.some((t) => child.tags.includes(t)))
        response.updatedCount += 1;
      else if (child.tags.includes(ChangeTag.WithdrawnRecord))
        response.withdrawnCount += 1;
      else response.unchangedCount += 1;

      return response;
    },
    { newCount: 0, updatedCount: 0, withdrawnCount: 0, unchangedCount: 0 }
  );
};
