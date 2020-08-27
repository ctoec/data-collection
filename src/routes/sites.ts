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
    const siteIds = parseQueryString(req, 'id', {
      post: parseInt,
      forceArray: true,
    }) as number[];
    const organizationIds = parseQueryString(req, 'organizationId', {
      post: parseInt,
      forceArray: true,
    }) as number[];
    const communityIds = parseQueryString(req, 'communityId', {
      post: parseInt,
      forceArray: true,
    }) as number[];

    const sites = await controller.getSites(
      req.user,
      siteIds,
      organizationIds,
      communityIds
    );

    res.send(sites);
  })
);
