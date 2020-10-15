import express from 'express';
import { Response, Request } from 'express';
import { BookType } from 'xlsx/types';

import * as controller from '../controllers/export';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { InternalServerError } from '../middleware/error/errors';
import { User } from '../entity';
import { getSites } from '../controllers/sites';
import { completeChildren as fakeChildren } from '../data/children';

export const exportRouter = express.Router();

/**
 * /export/roster GET
 * Ask the backend to compile a CSV of child objects formatted according
 * to the data template. Children are found by looking up all sites the
 * user has access to, finding all Children with enrollments at these sites,
 * filtering for duplicates, and compiling a report.
 */
exportRouter.get(
  '/roster',
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const user: User = req.user;
      const sites = await getSites(user);
      const childrenToMap = await controller.getChildrenBySites(sites);
      res.send(controller.streamUploadedChildren(res, childrenToMap));
    } catch (err) {
      console.error('Unable to generate CSV by user ID', err);
      throw new InternalServerError('Could not export roster for user: ' + err);
    }
  })
);

/**
 * /export/example/:fileType GET
 */
exportRouter.get(
  '/example/:fileType',
  passAsyncError(async (req: Request, res: Response) => {
    try {
      const fileType = req.params['fileType'] || 'csv';
      res.send(
        await controller.streamUploadedChildren(
          res,
          fakeChildren,
          fileType as BookType
        )
      );
    } catch (err) {
      console.error('Unable to generate CSV by user ID', err);
      throw new InternalServerError('Could not export roster for user: ' + err);
    }
  })
);
