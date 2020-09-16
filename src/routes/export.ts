import express from 'express';
import { Response, Request } from 'express';
import * as controller from '../controllers/export';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { getManager } from 'typeorm';
import { BadRequestError, NotFoundError } from '../middleware/error/errors';
import { EnrollmentReport, User } from '../entity';
import { getSites } from '../controllers/sites';

export const exportRouter = express.Router();

/**
 * /csv-upload-report/:reportId GET
 * Ask the backend to compile a CSV of child objects formatted according
 * to the data template. Children are found by querying a particular
 * enrollment report to provide a snapshot of the work the user just
 * uploaded.
 */
exportRouter.get(
  '/csv-upload/:reportId',
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params['reportId']) || 0;
      const report = await getManager().findOne(EnrollmentReport, id);

      if (!report) throw new NotFoundError();

      const childrenToMap = await controller.getChildrenByReport(report);
      res.send(controller.streamUploadedChildren(res, childrenToMap));
    } catch (err) {
      console.error('Unable to download exported enrollment data: ', err);
      throw new BadRequestError('Could not create spreadsheet to download');
    }
  })
);

/**
 * /csv-upload-user/:userId GET
 * Ask the backend to compile a CSV of child objects formatted according
 * to the data template. Children are found by looking up all sites the
 * user has access to, finding all Children with enrollments at these sites,
 * filtering for duplicates, and compiling a report.
 */
exportRouter.get(
  '/csv-upload/:userId',
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params['userId']) || 0;
      const user = await getManager().findOne(User, { id: userId });
      const sites = await getSites(user);
      const childrenToMap = await controller.getChildrenBySites(sites);
      res.send(controller.streamUploadedChildren(res, childrenToMap));
    } catch (err) {
      console.error('Unable to generate CSV by user ID', err);
      throw new BadRequestError('Could not create CSV from user ID: ' + err);
    }
  })
);
