import express, { Response, Request } from 'express';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { parseQueryString } from '../utils/parseQueryString';
import * as controller from '../controllers/sites';

export const sitesRouter = express.Router();

/**
 * /sites GET
 * /sites?id=1&organizationId=1&organizationId=2&communityId=3&communityId=4
 *
 * Returns all sites the currently authenticated user has
 * permissions to access. Supports filtering on multiple site,
 * organization and community ids.
 */
sitesRouter.get(
  '/',
  passAsyncError(async (req: Request, res: Response) => {
    const sites = await controller.getSites(req.user);

    res.send(sites);
  })
);
