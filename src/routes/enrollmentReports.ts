import express from 'express';
import fs from 'fs';
import multer from 'multer';
import { getManager } from 'typeorm';
import { Child } from '../entity';
import { BadRequestError, ApiError } from '../middleware/error/errors';
import { passAsyncError } from '../middleware/error/passAsyncError';
import * as controller from '../controllers/enrollmentReports';
import { ChangeTag } from '../../client/src/shared/models';

const CHANGE_TAGS_DENOTING_UPDATE = [
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
  filename: (req, _, callback) =>
    callback(null, `user_${req.user?.id}_` + new Date().toISOString()),
});
const upload = multer({ storage }).single('file');

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
        const childRecords = await controller.mapRows(
          transaction,
          req.user,
          reportRows
        );
        const columnErrors = await controller.checkErrorsInChildren(
          childRecords
        );

        if (columnErrors?.length) logUploadErrors(req.user.id, childRecords);

        // Only remove the file from disk if we could successfully parse it
        if (req?.file?.path) fs.unlinkSync(req.file.path);

        res.send({
          columnErrors,
          childRecords,
          counts: getUploadCounts(childRecords),
        });
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
      const { childRecords = [] } = req.body;

      // Save to DB
      await controller.batchUpsertMappedEntities(
        req.user,
        transaction,
        childRecords
      );

      res.status(201).send(getUploadCounts(childRecords));
    });
  })
);

// Use tags to count which kinds of uploads/updates were performed
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
