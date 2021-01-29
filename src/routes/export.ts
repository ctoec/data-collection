import express from 'express';
import { Response, Request } from 'express';

import * as controller from '../controllers/export';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { InternalServerError } from '../middleware/error/errors';
import { User } from '../entity';
import { getChildren } from '../controllers/children';
import { ListChildReponse } from '../../client/src/shared/payloads';

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
      const response: ListChildReponse = await getChildren(user);
      res.send(controller.streamUploadedChildren(res, response.children));
    } catch (err) {
      console.error('Unable to generate CSV by user ID', err);
      throw new InternalServerError('Could not export roster for user: ' + err);
    }
  })
);
