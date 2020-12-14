import express from 'express';
import { getManager } from 'typeorm';
import multer from 'multer';
import { Child, EnrollmentReport } from '../entity';
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
const temp = multer({ dest: '/tmp/uploads' }).single('file');
enrollmentReportsRouter.post(
  '/check',
  temp,
  passAsyncError(async (req, res) => {
    return getManager().transaction(async (tManager) => {
      try {
        const reportRows = controller.parseUploadedTemplate(req.file);
        const reportChildren: Child[] = await controller.mapRows(
          tManager,
          reportRows,
          req.user,
          { save: false }
        );
        // Need this line to create entities as the DB would see them.
        // Since only given properties are copied into the entities,
        // anything that winds up with missing info will set off
        // validation errors, which we need to find nested errors in
        // e.g. family address, enrollments, income dets, etc.
        const dbChildren = tManager.create(Child, reportChildren);
        const childrenWithErrors = await Promise.all(
          dbChildren.map(async (child) => {
            return {
              ...child,
              validationErrors: await validate(child),
              cascadeDeleteEnrollments: null,
            };
          })
        );
        const errorDict = await controller.checkErrorsInChildren(
          childrenWithErrors
        );

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
      } finally {
        if (req.file && req.file.path) fs.unlinkSync(req.file.path);
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
const upload = multer({ dest: '/tmp/uploads' }).single('file');
enrollmentReportsRouter.post(
  '/',
  upload,
  passAsyncError(async (req, res) => {
    return getManager().transaction(async (tManager) => {
      // Prepare for ingestion by removing any existing data
      try {
        const siteIdToReplace = req.query['overwriteSites'];
        const siteIdsToReplace = !siteIdToReplace
          ? undefined
          : ((Array.isArray(siteIdToReplace)
              ? siteIdToReplace
              : [siteIdToReplace]) as string[]);
        await controller.removeExistingEnrollmentDataForUser(
          tManager,
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
        const reportChildren = await controller.mapRows(
          tManager,
          reportRows,
          req.user,
          { save: true }
        );
        const report = await tManager.save(
          tManager.create(EnrollmentReport, { children: reportChildren })
        );

        let numActive = 0,
          numWithdrawn = 0;
        reportChildren.forEach((child) => {
          child.enrollments?.forEach((e) => {
            if (e.exit) numWithdrawn += 1;
            else numActive += 1;
          });
        });

        res.status(201).json({
          id: report.id,
          activeEnrollments: numActive,
          withdrawnEnrollments: numWithdrawn,
        } as BatchUpload);
      } catch (err) {
        if (err instanceof ApiError) throw err;

        console.error('Error parsing uploaded enrollment report: ', err);
        throw new BadRequestError(
          'Your file isn’t in the correct format. Use the spreadsheet template without changing the headers.'
        );
      } finally {
        if (req.file && req.file.path) fs.unlinkSync(req.file.path);
      }
    });
  })
);
