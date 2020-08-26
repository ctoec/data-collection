import express, { Response, Request } from 'express';
import { passAsyncError } from '../middleware/error/passAsyncError';
import { parseQS } from '../utils/parseQS';
import * as controller from '../controllers/sites';

export const sitesRouter = express.Router();

/**
 * /sites GET
 * /sites?id=1&organizationId=1&organizationId=2&communityId=3&communityId=4
 *
 * Returns all sites the currently authenticated user has
 * permissions to access. Supports filtering on multiple organization
 * and community ids.
 */
sitesRouter.get(
  '/',
  passAsyncError(async (req: Request, res: Response) => {
    // Apply user-supplied filters
    const siteIds = parseQS(req, 'id', {
      post: parseInt,
      forceArray: true,
    }) as number[];
    const organizationIds = parseQS(req, 'organizationId', {
      post: parseInt,
      forceArray: true,
    }) as number[];
    const communityIds = parseQS(req, 'communityId', {
      post: parseInt,
      forceArray: true,
    }) as number[];

    console.log(siteIds);

    const sites = await controller.getSites(
      req.user,
      siteIds,
      organizationIds,
      communityIds
    );

    res.send(sites);
  })
);
